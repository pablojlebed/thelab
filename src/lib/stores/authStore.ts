import { writable, derived } from 'svelte/store';
import { supabase } from '../supabase';

export type User = {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'analyst' | 'viewer';
    avatar?: string;
};

type AuthState = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
};

// Check if we're in development mode
export const isDev = import.meta.env.DEV;

// Dev user for bypassing auth in development
const DEV_USER: User = {
    id: 'dev-user-001',
    email: 'dev@radioanalysis.local',
    name: 'Dev User',
    role: 'admin',
};

function createAuthStore() {
    const initialState: AuthState = {
        user: null,
        isLoading: true,
        error: null,
    };

    const { subscribe, set, update } = writable<AuthState>(initialState);

    // Helper to map Supabase user to our User type
    function mapSupabaseUser(supabaseUser: any): User {
        return {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            role: supabaseUser.user_metadata?.role || 'analyst',
            avatar: supabaseUser.user_metadata?.avatar,
        };
    }

    return {
        subscribe,

        // Initialize auth - check for existing Supabase session
        init: async () => {
            if (isDev) {
                // Auto-authenticate in development mode
                console.log('🔓 Dev mode: Auto-authenticating...');
                set({
                    user: DEV_USER,
                    isLoading: false,
                    error: null,
                });
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth init error:', error);
                    set({ user: null, isLoading: false, error: error.message });
                    return;
                }

                if (session?.user) {
                    set({
                        user: mapSupabaseUser(session.user),
                        isLoading: false,
                        error: null,
                    });
                } else {
                    set({ user: null, isLoading: false, error: null });
                }

                // Listen for auth state changes
                supabase.auth.onAuthStateChange((_event, session) => {
                    if (session?.user) {
                        set({
                            user: mapSupabaseUser(session.user),
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        set({ user: null, isLoading: false, error: null });
                    }
                });
            } catch (err) {
                console.error('Auth init exception:', err);
                set({ user: null, isLoading: false, error: 'Failed to initialize auth' });
            }
        },

        // Login with email and password using Supabase Auth
        login: async (email: string, password: string) => {
            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    set({ user: null, isLoading: false, error: error.message });
                    return false;
                }

                if (data.user) {
                    set({
                        user: mapSupabaseUser(data.user),
                        isLoading: false,
                        error: null,
                    });
                    return true;
                }

                set({ user: null, isLoading: false, error: 'Login failed' });
                return false;
            } catch (err) {
                console.error('Login exception:', err);
                set({ user: null, isLoading: false, error: 'An error occurred during login' });
                return false;
            }
        },

        // Sign up with email and password
        signUp: async (email: string, password: string, name?: string) => {
            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name || email.split('@')[0],
                            role: 'analyst',
                        },
                    },
                });

                if (error) {
                    set({ user: null, isLoading: false, error: error.message });
                    return false;
                }

                if (data.user) {
                    // Note: User might need to confirm email before being fully authenticated
                    set({
                        user: mapSupabaseUser(data.user),
                        isLoading: false,
                        error: null,
                    });
                    return true;
                }

                set({ user: null, isLoading: false, error: 'Sign up failed' });
                return false;
            } catch (err) {
                console.error('Sign up exception:', err);
                set({ user: null, isLoading: false, error: 'An error occurred during sign up' });
                return false;
            }
        },

        // Logout using Supabase Auth
        logout: async () => {
            try {
                await supabase.auth.signOut();
                set({ user: null, isLoading: false, error: null });
            } catch (err) {
                console.error('Logout exception:', err);
                set({ user: null, isLoading: false, error: null });
            }
        },

        // Clear error
        clearError: () => {
            update(state => ({ ...state, error: null }));
        },

        // Force dev login (for testing)
        devLogin: () => {
            set({
                user: DEV_USER,
                isLoading: false,
                error: null,
            });
        },
    };
}

export const authStore = createAuthStore();

// Derived store for easy access to authentication status
export const isAuthenticated = derived(authStore, $auth => $auth.user !== null);
export const currentUser = derived(authStore, $auth => $auth.user);
export const isAuthLoading = derived(authStore, $auth => $auth.isLoading);
