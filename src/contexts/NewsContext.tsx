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
        .from('list_berita')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Gagal memuat berita', { description: error.message });
      } else {
        setNewsItems(data || []);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  const addNewsItem = async (newsData: NewsItemForInsert) => {
    const { data, error } = await supabase
      .from('list_berita')
      .insert([newsData])
      .select()
      .single();

    if (error) {
      toast.error('Gagal menambah berita', { description: error.message });
      console.error(error);
    } else if (data) {
      setNewsItems(prev => [data, ...prev]);
      toast.success('Berita berhasil ditambahkan');
    }
  };

  const updateNewsItem = async (id: string, newsData: Partial<NewsItemForInsert>) => {
    const { data, error } = await supabase
      .from('list_berita')
      .update({ ...newsData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Gagal memperbarui berita', { description: error.message });
    } else if (data) {
      setNewsItems(prev =>
        prev.map(item => (item.id === id ? data : item))
      );
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
      setNewsItems(prev => prev.filter(item => item.id !== id));
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