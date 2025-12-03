import { useContext } from 'react';
import { NewsContext } from '@/contexts/NewsContext';

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    // Hybrid approach: Return safe fallback instead of throwing error
    console.warn('useNews called outside NewsProvider - returning safe fallback');
    return {
      newsItems: [],
      addNewsItem: async () => {
        console.warn('addNewsItem called outside NewsProvider - no operation performed');
      },
      updateNewsItem: async () => {
        console.warn('updateNewsItem called outside NewsProvider - no operation performed');
      },
      deleteNewsItem: async () => {
        console.warn('deleteNewsItem called outside NewsProvider - no operation performed');
      },
      getNewsById: () => {
        console.warn('getNewsById called outside NewsProvider - returning undefined');
        return undefined;
      },
      loading: false
    };
  }
  return context;
}