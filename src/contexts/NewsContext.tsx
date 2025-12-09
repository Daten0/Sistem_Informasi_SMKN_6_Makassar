import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useRef,
} from "react";
import supabase from "@/supabase";
import { toast } from "sonner";

export interface NewsItem {
  id: string;
  created_at: string;
  updated_at?: string | null;
  judul_berita: string;
  ringkasan: string;
  konten: string;
  publikasi_berita: "publikasi" | "draft";
  kategori_berita: "Prestasi" | "Terkini" | "Ekskul" | "Daily";
  tags: string[];
  gambar_berita: string;
  author_id?: string | null;
}

export type NewsItemForInsert = Omit<
  NewsItem,
  "id" | "created_at" | "updated_at"
> & {
  author_id?: string;
};

interface NewsContextType {
  newsItems: NewsItem[];
  addNewsItem: (newsData: NewsItemForInsert) => Promise<void>;
  updateNewsItem: (
    id: string,
    newsData: Partial<NewsItemForInsert>
  ) => Promise<void>;
  deleteNewsItem: (id: string) => Promise<void>;
  getNewsById: (id: string) => NewsItem | undefined;
  loading: boolean;
  refreshNews: () => Promise<void>;
}

export const NewsContext = createContext<NewsContextType | undefined>(
  undefined
);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    fetchNews();
    setupRealtimeListener();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      isMountedRef.current = false;
    };
  }, []);

  const isSessionExpiredError = (error: any) => {
    return !error
      ? false
      : error?.code === "PGRST301" ||
          error?.code === "INVALID_JWT" ||
          (error?.message &&
            /401|unauthorized|expired|invalid/i.test(error.message));
  };

  const setupRealtimeListener = async () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel("list_berita_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "list_berita" },
        () => {
          // Defer fetch to avoid setState-during-render warnings
          setTimeout(() => {
            if (isMountedRef.current) fetchNews();
          }, 0);
        }
      )
      .subscribe();
  };

  const fetchNews = async () => {
    if (!isMountedRef.current) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("list_berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        if (isSessionExpiredError(error)) {
          // try a single refresh and retry
          try {
            const { error: refreshError } =
              await supabase.auth.refreshSession();
            if (refreshError) {
              console.warn("refresh failed", refreshError);
              toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            } else {
              const { data: retryData, error: retryError } = await supabase
                .from("list_berita")
                .select("*")
                .order("created_at", { ascending: false });
              if (retryError) {
                toast.error("Gagal memuat berita", {
                  description: retryError.message,
                });
              } else {
                if (isMountedRef.current) setNewsItems(retryData || []);
              }
            }
          } catch (e) {
            console.error("Error during refresh retry", e);
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          }
        } else {
          toast.error("Gagal memuat berita", { description: error.message });
        }
      } else {
        if (isMountedRef.current) setNewsItems(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching news:", error);
      toast.error("Terjadi kesalahan saat memuat berita");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const addNewsItem = async (newsData: NewsItemForInsert) => {
    try {
      const { data, error } = await supabase
        .from("list_berita")
        .insert([newsData])
        .select();

      if (error) {
        toast.error("Gagal menambah berita", { description: error.message });
      } else if (data && data.length > 0) {
        toast.success("Berita berhasil ditambahkan");
      }
    } catch (err) {
      console.error("Error adding news:", err);
      toast.error("Terjadi kesalahan saat menambah berita");
    }
  };

  const updateNewsItem = async (
    id: string,
    newsData: Partial<NewsItemForInsert>
  ) => {
    try {
      const { data, error } = await supabase
        .from("list_berita")
        .update({ ...newsData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();

      if (error) {
        toast.error("Gagal memperbarui berita", { description: error.message });
      } else if (data && data.length > 0) {
        toast.success("Berita berhasil diperbarui");
      }
    } catch (err) {
      console.error("Error updating news:", err);
      toast.error("Terjadi kesalahan saat memperbarui berita");
    }
  };

  const deleteNewsItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("list_berita")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Gagal menghapus berita", { description: error.message });
      } else {
        toast.success("Berita berhasil dihapus");
      }
    } catch (err) {
      console.error("Error deleting news:", err);
      toast.error("Terjadi kesalahan saat menghapus berita");
    }
  };

  const getNewsById = (id: string) => {
    return newsItems.find((item) => item.id === id);
  };

  const value = {
    newsItems,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    getNewsById,
    loading,
    refreshNews: fetchNews,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
}
