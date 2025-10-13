import { useState, useEffect } from 'react';

export interface LastReadStory {
  story_code: string;
  title: string;
  author: string;
  timestamp: string;
}

export const useLastReadStory = () => {
  const [lastReadStory, setLastReadStory] = useState<LastReadStory | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastReadStory');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLastReadStory(parsed);
      }
    } catch (error) {
      console.error('Error reading last read story from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('lastReadStory');
    }
  }, []);

  return lastReadStory;
};
