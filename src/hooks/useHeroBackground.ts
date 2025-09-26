import { useEffect, useState } from 'react';
import axios from 'axios';

export interface HeroBackground {
  page_name: string;
  background_image_url: string | null;
  background_type: 'image' | 'video';
  fallback_image_url?: string | null;
}

export function useHeroBackground(pageName: string) {
  const [background, setBackground] = useState<HeroBackground | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBackground = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/hero-backgrounds/${encodeURIComponent(pageName)}`);
        if (!isMounted) return;
        setBackground(res.data || null);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Ошибка загрузки фона');
        setBackground(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBackground();

    return () => {
      isMounted = false;
    };
  }, [pageName]);

  return { background, loading, error };
}

