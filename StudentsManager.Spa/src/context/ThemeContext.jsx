import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'students-manager-theme';
const ThemeContext = createContext(null);

function getStoredTheme() {
    if (typeof window === 'undefined') return null;

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null;
}

function getPreferredTheme() {
    if (typeof window === 'undefined') return 'light';

    const storedTheme = getStoredTheme();
    if (storedTheme) return storedTheme;

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getPreferredTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            isDarkTheme: theme === 'dark',
            setTheme,
            toggleTheme: () => {
                setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
            },
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
