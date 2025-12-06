import React, { 
  createContext, 
  useState, 
  useEffect, 
  ReactNode,
  useContext,
  useMemo,
  useRef,
 } from 'react';
import supabase from '@/supabase';
import { toast } from 'sonner';

export interface NewsItem {
  id: string;
  created_at: string;
  updated_at?: string | null;
  judul_berita: string;
  ringkasan: string;
  konten: string;
  publikasi_berita: 'publikasi' | 'draft';
  kategori_berita: 'Prestasi' | 'Terkini' | 'Ekskul' | 'Daily';
  tags: string[];
  gambar_berita: string;
  author_id?: string | null;
}

export type NewsItemForInsert = Omit<NewsItem, 'id' | 'created_at' | 'updated_at'> & {
  author_id?: string;
};

interface NewsContextType {
  newsItems: NewsItem[];
  addNewsItem: (newsData: NewsItemForInsert) => Promise<void>;
  updateNewsItem: (id: string, newsData: Partial<NewsItemForInsert>) => Promise<void>;
  deleteNewsItem: (id: string) => Promise<void>;
  getNewsById: (id: string) => NewsItem | undefined;
  loading: boolean;
  refreshNews: () => Promise<void>;
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const channelRef = useRef<any>(null);
  const isPageVisibleRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Handle page visibility - Re-establish connection when returning to tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        isPageVisibleRef.current = true;
        // Re-fetch and re-subscribe when page becomes visible
        if (isMountedRef.current) {
          await fetchNews();
          await setupRealtimeListener();
        }
      } else {
        isPageVisibleRef.current = false;
        // Clean up subscription when page is hidden
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const setupRealtimeListener = async () => {
    if (!isMountedRef.current) return;

    // Clean up old channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription
    channelRef.current = supabase
      .channel("list_berita_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "list_berita" }, () => {
        if (isMountedRef.current && isPageVisibleRef.current) {
          fetchNews();
        }
      })
      .subscribe();
  };

  const isSessionExpiredError = (error: any): boolean => {
    // Check for various session expiration indicators
    return (
      error?.code === 'PGRST301' || // Unauthorized error code
      error?.code === 'INVALID_JWT' ||
      error?.message?.includes('401') ||
      error?.message?.includes('unauthorized') ||
      error?.message?.includes('expired')
    );
  };

  const fetchNews = async () => {
    if (!isMountedRef.current) return;

    try {
      if (isMountedRef.current) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from("list_berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMountedRef.current) return;

      if (error) {
        console.error("Supabase error:", error);
        
        // Check for authentication errors
        if (isSessionExpiredError(error)) {
          console.warn("Session expired - attempting refresh");
          
          // Try to refresh session
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !isMountedRef.current) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            // Don't redirect here - let AuthContext handle it
            return;
          }
          
          // Retry fetch after refresh
          const { data: retryData, error: retryError } = await supabase
            .from("list_berita")
            .select("*")
            .order("created_at", { ascending: false });

          if (!isMountedRef.current) return;

          if (retryError) {
            toast.error("Gagal memuat berita", { description: retryError.message });
          } else {
            setNewsItems(retryData || []);
          }
        } else {
          toast.error("Gagal memuat berita", { description: error.message });
        }
      } else {
        setNewsItems(data || []);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Unexpected error fetching news:", err);
      toast.error("Terjadi kesalahan saat memuat berita");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch and setup
  useEffect(() => {
    if (!isMountedRef.current) return;

    fetchNews();
    setupRealtimeListener();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const addNewsItem = async (newsData: NewsItemForInsert) => {
    if (!isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from("list_berita")
        .insert([newsData])
        .select();

      if (!isMountedRef.current) return;

      if (error) {
        if (isSessionExpiredError(error)) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error("Gagal menambah berita", { description: error.message });
        }
        console.error(error);
      } else if (data && data.length > 0) {
        toast.success("Berita berhasil ditambahkan");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error adding news:", err);
      toast.error("Terjadi kesalahan saat menambah berita");
    }
  };

  const updateNewsItem = async (id: string, newsData: Partial<NewsItemForInsert>) => {
    if (!isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from("list_berita")
        .update({ ...newsData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();

      if (!isMountedRef.current) return;

      if (error) {
        if (isSessionExpiredError(error)) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error("Gagal memperbarui berita", { description: error.message });
        }
      } else if (data && data.length > 0) {
        toast.success("Berita berhasil diperbarui");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error updating news:", err);
      toast.error("Terjadi kesalahan saat memperbarui berita");
    }
  };

  const deleteNewsItem = async (id: string) => {
    if (!isMountedRef.current) return;

    try {
      const { error } = await supabase
        .from("list_berita")
        .delete()
        .eq("id", id);

      if (!isMountedRef.current) return;

      if (error) {
        if (isSessionExpiredError(error)) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error("Gagal menghapus berita", { description: error.message });
        }
      } else {
        toast.success("Berita berhasil dihapus");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error deleting news:", err);
      toast.error("Terjadi kesalahan saat menghapus berita");
    }
  };

  const getNewsById = (id: string) => {
    return newsItems.find((item) => item.id === id);
  };

  const value = useMemo(
    () => ({
      newsItems,
      addNewsItem,
      updateNewsItem,
      deleteNewsItem,
      getNewsById,
      loading,
      refreshNews: fetchNews,
    }),
    [newsItems, loading],
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    console.warn("useNews called outside of NewsProvider - returning safe fallback");
    return {
      newsItems: [],
      addNewsItem: async () => {},
      updateNewsItem: async () => {},
      deleteNewsItem: async () => {},
      getNewsById: () => undefined,
      loading: false,
      refreshNews: async () => {},
    };
  }
  return context;
}