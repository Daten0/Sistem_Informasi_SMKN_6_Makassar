import React, { createContext, useState, useEffect } from 'react';

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  status: 'published' | 'draft';
  views: number;
  image: string;
  category: string;
  tags: string[];
}

interface NewsContextType {
  newsItems: NewsItem[];
  addNewsItem: (newsData: Omit<NewsItem, 'id' | 'views' | 'publishDate'>) => void;
  updateNewsItem: (id: number, newsData: Partial<NewsItem>) => void;
  deleteNewsItem: (id: number) => void;
  getNewsById: (id: number) => NewsItem | undefined;
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Default news items for demo
const defaultNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Tips Menggunakan AI dalam Bisnis Modern",
    excerpt: "Pelajari bagaimana AI dapat meningkatkan efisiensi dan produktivitas bisnis Anda...",
    content: "Artificial Intelligence (AI) telah menjadi game-changer dalam dunia bisnis modern. Dengan kemampuan untuk menganalisis data dalam skala besar dan memberikan insights yang berharga, AI membantu perusahaan membuat keputusan yang lebih cerdas dan strategis.",
    publishDate: "2024-01-15",
    status: "published",
    views: 234,
    image: "/api/placeholder/300/200",
    category: "teknologi",
    tags: ["AI", "Bisnis", "Teknologi"]
  },
  {
    id: 2,
    title: "Tren Teknologi yang Akan Mengubah Dunia",
    excerpt: "Eksplorasi teknologi terdepan yang akan membentuk masa depan...",
    content: "Teknologi terus berkembang dengan pesat, membawa perubahan fundamental dalam cara kita hidup dan bekerja. Dari blockchain hingga quantum computing, inovasi-inovasi ini akan membentuk masa depan dunia.",
    publishDate: "2024-01-14",
    status: "draft",
    views: 0,
    image: "/api/placeholder/300/200",
    category: "teknologi",
    tags: ["Teknologi", "Inovasi", "Masa Depan"]
  },
  {
    id: 3,
    title: "Panduan Lengkap Digital Marketing 2024",
    excerpt: "Strategi marketing digital yang efektif untuk meningkatkan brand awareness...",
    content: "Digital marketing telah menjadi tulang punggung strategi pemasaran modern. Dengan berbagai platform dan tools yang tersedia, bisnis dapat menjangkau target audience dengan lebih efektif dan terukur.",
    publishDate: "2024-01-13",
    status: "published",
    views: 189,
    image: "/placeholder.svg",
    category: "bisnis",
    tags: ["Marketing", "Digital", "Strategi"]
  }
];

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const stored = localStorage.getItem('newsItems');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading news from localStorage:', error);
        return defaultNewsItems;
      }
    }
    return defaultNewsItems;
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('newsItems');
    if (stored) {
      try {
        setNewsItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading news from localStorage:', error);
        setNewsItems(defaultNewsItems);
      }
    } else {
      setNewsItems(defaultNewsItems);
    }
  }, []);

  // Save to localStorage whenever newsItems changes
  useEffect(() => {
    if (newsItems.length > 0) {
      localStorage.setItem('newsItems', JSON.stringify(newsItems));
    }
  }, [newsItems]);

  const addNewsItem = (newsData: Omit<NewsItem, 'id' | 'views' | 'publishDate'>) => {
    const newItem: NewsItem = {
      ...newsData,
      id: Date.now(), // Simple ID generation
      views: 0,
      publishDate: new Date().toISOString().split('T')[0]
    };
    
    setNewsItems(prev => [newItem, ...prev]);
  };

  const updateNewsItem = (id: number, newsData: Partial<NewsItem>) => {
    setNewsItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...newsData } : item
      )
    );
  };

  const deleteNewsItem = (id: number) => {
    setNewsItems(prev => prev.filter(item => item.id !== id));
  };

  const getNewsById = (id: number) => {
    return newsItems.find(item => item.id === id);
  };

  return (
    <NewsContext.Provider value={{
      newsItems,
      addNewsItem,
      updateNewsItem,
      deleteNewsItem,
      getNewsById
    }}>
      {children}
    </NewsContext.Provider>
  );
}