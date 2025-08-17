import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to ensure authenticated users have a profile
 * Creates profile if missing during app startup
 */
export const useProfileEnsurance = () => {
  useEffect(() => {
    const ensureProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('📋 Checking if profile exists for user:', session.user.id);
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create default user profile
            console.log('📋 Creating default profile for user:', session.user.id);
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{
                id: session.user.id,
                role: 'user'
              }]);
            
            if (insertError) {
              console.error('❌ Failed to create profile:', insertError);
              toast.error('Failed to create user profile');
            } else {
              console.log('✅ Default profile created successfully');
            }
          } else if (profile) {
            console.log('📋 Profile exists with role:', profile.role);
          } else if (profileError) {
            console.error('❌ Profile check error:', profileError);
          }
        }
      } catch (error) {
        console.error('❌ Profile ensurance error:', error);
      }
    };

    ensureProfile();

    // Listen for auth changes to ensure profile after login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Small delay to ensure auth is fully established
          setTimeout(() => {
            ensureProfile();
          }, 500);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
};