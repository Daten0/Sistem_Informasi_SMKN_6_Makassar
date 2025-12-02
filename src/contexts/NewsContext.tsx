import React, { createContext, useState, useEffect, ReactNode } from 'react';
import supabase from '@/supabase';
import { toast } from 'sonner';

// Matches the Supabase 'list_berita' table
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

// Type for data used when creating a new news item
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
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("list_berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Gagal memuat berita", { description: error.message });
      } else {
        setNewsItems(data || []);
      }
      setLoading(false);
    };

    fetchNews();

    const channel = supabase
      .channel("list_berita_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "list_berita" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.eventType === "INSERT") {
            setNewsItems((prev) => [payload.new as NewsItem, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNewsItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as NewsItem) : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNewsItems((prev) =>
              prev.filter((item) => item.id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addNewsItem = async (newsData: NewsItemForInsert) => {
    const { data, error } = await supabase
      .from('list_berita')
      .insert([newsData])
      .select();

    if (error) {
      toast.error('Gagal menambah berita', { description: error.message });
      console.error(error);
    } else if (data && data.length > 0) {
      // setNewsItems(prev => [data[0], ...prev]);
      toast.success('Berita berhasil ditambahkan');
    }
  };

  const updateNewsItem = async (id: string, newsData: Partial<NewsItemForInsert>) => {
    const { data, error } = await supabase
      .from('list_berita')
      .update({ ...newsData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      toast.error('Gagal memperbarui berita', { description: error.message });
    } else if (data && data.length > 0) {
      // const updatedItem = data[0];
      // setNewsItems(prev =>
      //   prev.map(item => (item.id === id ? updatedItem : item))
      // );
      toast.success('Berita berhasil diperbarui');
    }
  };

  const deleteNewsItem = async (id: string) => {
    const { error } = await supabase
      .from('list_berita')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Gagal menghapus berita', { description: error.message });
    } else {
      // setNewsItems(prev => prev.filter(item => item.id !== id));
      toast.success('Berita berhasil dihapus');
    }
  };

  const getNewsById = (id: string) => {
    return newsItems.find(item => item.id === id);
  };

  return (
    <NewsContext.Provider value={{
      newsItems,
      addNewsItem,
      updateNewsItem,
      deleteNewsItem,
      getNewsById,
      loading
    }}>
      {children}
    </NewsContext.Provider>
  );
}