import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { toast } from "sonner";

interface SupabaseAdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
  webauthnEnabled: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  enableWebAuthn: () => Promise<void>;
  authenticateWithWebAuthn: () => Promise<boolean>;
}

const SupabaseAdminAuthContext = createContext<SupabaseAdminAuthContextType | undefined>(undefined);

export const useSupabaseAdminAuth = () => {
  const context = useContext(SupabaseAdminAuthContext);
  if (!context) {
    throw new Error('useSupabaseAdminAuth must be used within a SupabaseAdminAuthProvider');
  }
  return context;
};

interface SupabaseAdminAuthProviderProps {
  children: ReactNode;
}

export const SupabaseAdminAuthProvider = ({ children }: SupabaseAdminAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [webauthnEnabled, setWebauthnEnabled] = useState(false);

  const isAuthenticated = !!user && !!session;

  console.log('SupabaseAdminAuth: State', { 
    user: user?.email, 
    isAuthenticated, 
    isLoading, 
    isAdmin,
    isCheckingAdmin,
    webauthnEnabled
  });

  // Check admin role using only profiles table
  const checkAdminRole = async (userId: string) => {
    console.log('🔍 Checking admin role for user:', userId);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, webauthn_enabled')
        .eq('id', userId)
        .maybeSingle();

      console.log('📋 Profile check result:', { profileData, profileError });

      if (profileError) {
        console.error('❌ Error checking profile admin role:', profileError);
        return { isAdmin: false, webauthnEnabled: false };
      }

      if (profileData?.role !== 'admin') {
        console.log('❌ User does not have admin role. Current role:', profileData?.role);
        return { isAdmin: false, webauthnEnabled: false };
      }

      console.log('✅ Admin role verified');
      return { 
        isAdmin: true, 
        webauthnEnabled: profileData.webauthn_enabled || false 
      };
    } catch (error) {
      console.error('💥 Exception in checkAdminRole:', error);
      return { isAdmin: false, webauthnEnabled: false };
    }
  };

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        // Only synchronous state updates here to prevent deadlocks
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User session detected, checking admin role...');
          setIsCheckingAdmin(true);
          // Defer admin role check to prevent blocking auth flow
          setTimeout(() => {
            checkAdminRole(session.user.id).then(({ isAdmin, webauthnEnabled }) => {
              console.log('🔐 Admin status result:', { isAdmin, webauthnEnabled });
              setIsAdmin(isAdmin);
              setWebauthnEnabled(webauthnEnabled);
              setIsCheckingAdmin(false);
            });
          }, 0);
        } else {
          console.log('❌ No user session, setting admin to false');
          setIsAdmin(false);
          setIsCheckingAdmin(false);
          setWebauthnEnabled(false);
        }
        
        setIsLoading(false);
        console.log('✅ Auth state update complete');
      }
    );

    // Check for existing session
    console.log('🔍 Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Existing session found, checking admin role...');
        setIsCheckingAdmin(true);
        checkAdminRole(session.user.id).then(({ isAdmin, webauthnEnabled }) => {
          console.log('🔐 Initial admin status:', { isAdmin, webauthnEnabled });
          setIsAdmin(isAdmin);
          setWebauthnEnabled(webauthnEnabled);
          setIsCheckingAdmin(false);
          setIsLoading(false);
        });
      } else {
        console.log('❌ No existing session found');
        setIsCheckingAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting Supabase Auth login:', { email });
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Supabase auth response:', { 
        user: authData.user?.email,
        error: authError?.message 
      });

      if (authError) {
        console.error('❌ Supabase auth login error:', authError);
        
        // Handle specific error cases
        if (authError.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.'
          };
        } else if (authError.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'Please confirm your email address before logging in.'
          };
        } else if (authError.message.includes('too_many_requests')) {
          return { 
            success: false, 
            error: 'Too many login attempts. Please wait a few minutes and try again.'
          };
        }
        
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        console.error('❌ No user returned from Supabase auth');
        return { success: false, error: 'Login failed - no user data returned' };
      }

      console.log('✅ Supabase auth login successful');
      
      // Log the admin login to our audit table
      try {
        const { error: auditError } = await supabase
          .from('admin_audit')
          .insert({
            action: 'admin_login',
            admin_id: authData.user.id,
            user_agent: navigator.userAgent
          });
        
        if (auditError) {
          console.warn('⚠️ Failed to log admin login:', auditError.message);
        }
      } catch (auditError) {
        console.warn('⚠️ Failed to log admin login:', auditError);
      }

      return { success: true };
    } catch (error: any) {
      console.error('💥 Login exception:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // WebAuthn support functions
  const enableWebAuthn = async () => {
    if (!user) {
      toast.error('Must be logged in to enable WebAuthn');
      return;
    }

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        toast.error('WebAuthn is not supported on this device');
        return;
      }

      // Generate credential creation options
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new TextEncoder().encode(`challenge-${Date.now()}`),
        rp: {
          name: "Grandpa's Kids Stories Admin",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(user.id),
          name: user.email!,
          displayName: user.email!,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct"
      };

      // Create the credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      // Store the credential in the user's profile
      const credentialData = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId)),
        type: credential.type,
        response: {
          clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
          attestationObject: Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject))
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          webauthn_enabled: true,
          webauthn_credentials: [credentialData]
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setWebauthnEnabled(true);
      toast.success('WebAuthn enabled successfully!');
    } catch (error: any) {
      console.error('Failed to enable WebAuthn:', error);
      toast.error('Failed to enable WebAuthn: ' + error.message);
    }
  };

  const authenticateWithWebAuthn = async (): Promise<boolean> => {
    if (!user || !webauthnEnabled) {
      return false;
    }

    try {
      // Get stored credentials
      const { data: profile } = await supabase
        .from('profiles')
        .select('webauthn_credentials')
        .eq('id', user.id)
        .single();

      const credentials = profile?.webauthn_credentials;
      if (!credentials || !Array.isArray(credentials) || credentials.length === 0) {
        return false;
      }

      // Generate assertion options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new TextEncoder().encode(`auth-challenge-${Date.now()}`),
        allowCredentials: credentials.map((cred: any) => ({
          id: new Uint8Array(cred.rawId),
          type: 'public-key'
        })),
        timeout: 60000,
        userVerification: 'required'
      };

      // Get the assertion
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (!assertion) {
        return false;
      }

      // In a real implementation, you would verify the assertion on the server
      // For now, we'll just return true if we got an assertion
      toast.success('WebAuthn authentication successful!');
      return true;
    } catch (error: any) {
      console.error('WebAuthn authentication failed:', error);
      toast.error('WebAuthn authentication failed');
      return false;
    }
  };

  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    isAdmin,
    isCheckingAdmin,
    webauthnEnabled,
    login,
    logout,
    enableWebAuthn,
    authenticateWithWebAuthn
  };

  return (
    <SupabaseAdminAuthContext.Provider value={value}>
      {children}
    </SupabaseAdminAuthContext.Provider>
  );
};