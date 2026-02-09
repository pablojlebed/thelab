import { writable } from 'svelte/store';

// Check for saved theme or system preference
const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
};

function createThemeStore() {
    const { subscribe, set, update } = writable(getInitialTheme());

    return {
        subscribe,
        toggle: () => {
            update(isDark => {
                const newTheme = !isDark;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
                    if (newTheme) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
                return newTheme;
            });
        },
        init: () => {
            const isDark = getInitialTheme();
            if (typeof window !== 'undefined') {
                if (isDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            set(isDark);
        }
    };
}

export const themeStore = createThemeStore();
