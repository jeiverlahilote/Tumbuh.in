import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Tables = Database['public']['Tables'];

export function useRealTimeData<T extends keyof Tables>(
  tableName: T,
  initialData: Tables[T]['Row'][] = []
) {
  const [data, setData] = useState<Tables[T]['Row'][]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;
    let timeoutId: NodeJS.Timeout;

    // Force timeout after 10 seconds
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn(`Data fetch timeout for ${tableName}, using fallback data`);
        setIsLoading(false);
        setError(null);
        setData(getFallbackData(tableName));
      }
    }, 10000);

    // Fetch initial data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: fetchedData, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (mounted) {
          setData(fetchedData || []);
          setError(null);
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
          setData(getFallbackData(tableName));
          clearTimeout(timeoutId);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Set up real-time subscription
    const setupSubscription = () => {
      try {
        subscription = supabase
          .channel(`${tableName}_changes`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: tableName
            },
            (payload) => {
              if (!mounted) return;

              console.log(`Real-time update for ${tableName}:`, payload);
              
              if (payload.eventType === 'INSERT') {
                setData(current => [payload.new as Tables[T]['Row'], ...current]);
              } else if (payload.eventType === 'UPDATE') {
                setData(current =>
                  current.map(item =>
                    item.id === payload.new.id ? (payload.new as Tables[T]['Row']) : item
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setData(current =>
                  current.filter(item => item.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error('Error setting up subscription:', err);
      }
    };

    // Setup subscription after initial fetch
    const timer = setTimeout(setupSubscription, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      clearTimeout(timer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [tableName]);

  return { data, isLoading, error, setData };
}

// Fallback data for when database is not available
function getFallbackData(tableName: string): any[] {
  switch (tableName) {
    case 'crop_predictions':
      return [];
    case 'warnings':
      return [];
    case 'profiles':
      return [];
    default:
      return [];
  }
}