import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HomeContent {
  [key: string]: string;
}

export const useHomeContent = () => {
  const [content, setContent] = useState<HomeContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('home_content')
        .select('section_key, content, image_url');

      if (data) {
        const map: HomeContent = {};
        data.forEach((item: any) => {
          // For image fields, prefer image_url, fallback to content
          map[item.section_key] = item.image_url || item.content || '';
        });
        setContent(map);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  // Helper to get a value with a fallback default
  const get = (key: string, fallback: string = '') => {
    return content[key] || fallback;
  };

  return { content, loading, get };
};
