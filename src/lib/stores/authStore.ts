import { writable, derived } from 'svelte/store';

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

    return {
        subscribe,

        // Initialize auth - auto-login in dev mode
        init: () => {
            if (isDev) {
                // Auto-authenticate in development mode
                console.log('🔓 Dev mode: Auto-authenticating...');
                set({
                    user: DEV_USER,
                    isLoading: false,
                    error: null,
                });
            } else {
                // In production, check for existing session
                // This would typically check localStorage or a session cookie
                const savedUser = localStorage.getItem('auth_user');
                if (savedUser) {
                    try {
                        set({
                            user: JSON.parse(savedUser),
                            isLoading: false,
                            error: null,
                        });
                    } catch {
                        set({ user: null, isLoading: false, error: null });
                    }
                } else {
                    set({ user: null, isLoading: false, error: null });
                }
            }
        },

        // Login with credentials
        login: async (email: string, password: string) => {
            update(state => ({ ...state, isLoading: true, error: null }));

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Demo credentials check (replace with real auth in production)
            if (email === 'admin@radioanalysis.com' && password === 'admin123') {
                const user: User = {
                    id: 'user-001',
                    email,
                    name: 'Pablo Lebed',
                    role: 'admin',
                };

                if (!isDev) {
                    localStorage.setItem('auth_user', JSON.stringify(user));
                }

                set({ user, isLoading: false, error: null });
                return true;
            } else if (email === 'analyst@radioanalysis.com' && password === 'analyst123') {
                const user: User = {
                    id: 'user-002',
                    email,
                    name: 'Sarah Chen',
                    role: 'analyst',
                };

                if (!isDev) {
                    localStorage.setItem('auth_user', JSON.stringify(user));
                }

                set({ user, isLoading: false, error: null });
                return true;
            }

            set({ user: null, isLoading: false, error: 'Invalid email or password' });
            return false;
        },

        // Logout
        logout: () => {
            localStorage.removeItem('auth_user');
            set({ user: null, isLoading: false, error: null });
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
