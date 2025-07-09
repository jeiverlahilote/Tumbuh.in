import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Force timeout after 5 seconds to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth initialization timeout, proceeding without auth');
        setIsLoading(false);
        setUser(null);
      }
    }, 5000);

    const initializeAuth = async () => {
      try {
        // Test Supabase connection first
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase connection error:', error);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        if (data.session?.user && mounted) {
          await handleUserSession(data.session.user);
        } else if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    const handleUserSession = async (authUser: SupabaseUser) => {
      try {
        // Try to fetch profile with timeout
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
        );

        const { data: profile, error } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (profile && mounted) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            location: profile.location || 'Kecamatan Cianjur',
            joinDate: profile.join_date,
            contributions: profile.contributions || 0,
            rank: profile.rank || 0
          });
        } else if (mounted) {
          // Create profile if doesn't exist
          await createUserProfile(authUser);
        }
      } catch (error) {
        console.error('Error handling user session:', error);
        // Fallback: create minimal user object
        if (mounted) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
            location: 'Belum diatur',
            joinDate: new Date().toISOString(),
            contributions: 0,
            rank: 0
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const createUserProfile = async (authUser: SupabaseUser) => {
      try {
        const newProfile = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
          location: null, // Will be set when user submits first data
          contributions: 0,
          rank: 0,
          accuracy_score: 0
        };

        const { data: createdProfile, error } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (error && error.code === '23505') {
          // Profile already exists, fetch it
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (existingProfile && mounted) {
            setUser({
              id: existingProfile.id,
              email: existingProfile.email,
              name: existingProfile.name,
              location: existingProfile.location || 'Belum diatur',
              joinDate: existingProfile.join_date,
              contributions: existingProfile.contributions || 0,
              rank: existingProfile.rank || 0
            });
          }
        } else if (createdProfile && mounted) {
          setUser({
            id: createdProfile.id,
            email: createdProfile.email,
            name: createdProfile.name,
            location: createdProfile.location || 'Belum diatur',
            joinDate: createdProfile.join_date,
            contributions: createdProfile.contributions || 0,
            rank: createdProfile.rank || 0
          });
        }
      } catch (error) {
        console.error('Error creating profile:', error);
        // Fallback: create minimal user object
        if (mounted) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
            location: 'Belum diatur',
            joinDate: new Date().toISOString(),
            contributions: 0,
            rank: 0
          });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        clearTimeout(timeoutId);

        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data.user;
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, isLoading, login, signup, logout };
}