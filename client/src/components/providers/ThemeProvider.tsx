import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';

type Theme = "dark" | "light";
type ColorTheme = "yellow" | "blue" | "green" | "purple" | "red" | "orange" | "teal" | "indigo" | "pink" | "lime" | "cyan" | "amber" | "emerald" | "violet" | "rose" | "sky" | "fuchsia" | "slate";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
      
      // Check system preference if no stored theme
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      return systemPreference;
    }
    return "light";
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("colorTheme") as ColorTheme;
      // Allow all color themes including green variants
      if (stored) return stored;
    }
    return "yellow";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add no-transition class to prevent animations on page load
    root.classList.add("no-transition");
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#1f2937" : "#ffffff");
    }
    
    localStorage.setItem("theme", theme);
    
    // Re-enable transitions after a brief delay
    setTimeout(() => {
      root.classList.remove("no-transition");
    }, 50);
  }, [theme]);

  // Load theme preferences from backend for logged-in users
  useEffect(() => {
    const loadThemePreferences = async () => {
      if (isLoggedIn && user) {
        try {
          const response = await fetch('/api/user/preferences', {
            headers: {
              'user-id': user.id.toString()
            }
          });
          
          if (response.ok) {
            const preferences = await response.json();
            if (preferences.theme) {
              setTheme(preferences.theme);
            }
            if (preferences.colorTheme) {
              setColorTheme(preferences.colorTheme);
            }
          }
        } catch (error) {
          console.error('Error loading theme preferences:', error);
        }
      }
    };

    loadThemePreferences();
  }, [isLoggedIn, user]);

  // Save theme preferences to backend
  const saveThemePreferences = async (preferences: { theme?: Theme; colorTheme?: ColorTheme }) => {
    if (isLoggedIn && user) {
      try {
        await fetch('/api/user/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'user-id': user.id.toString()
          },
          body: JSON.stringify(preferences)
        });
      } catch (error) {
        console.error('Error saving theme preferences:', error);
      }
    }
  };

  // Enhanced theme setters that save to backend
  const setThemeWithBackend = async (newTheme: Theme) => {
    setTheme(newTheme);
    await saveThemePreferences({ theme: newTheme });
  };

  const setColorThemeWithBackend = async (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme);
    await saveThemePreferences({ colorTheme: newColorTheme });
  };

  // Handle color theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing color theme classes
    root.classList.remove("theme-yellow", "theme-blue", "theme-green", "theme-purple", "theme-red", "theme-orange", "theme-teal", "theme-indigo", "theme-pink", "theme-lime", "theme-cyan", "theme-amber", "theme-emerald", "theme-violet", "theme-rose", "theme-sky", "theme-fuchsia", "theme-slate");
    
    // Add new color theme class
    root.classList.add(`theme-${colorTheme}`);
    
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  // Listen for system theme changes and keyboard shortcuts
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Keyboard shortcut: Ctrl/Cmd + Shift + D to toggle dark mode
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    document.addEventListener("keydown", handleKeyboard);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [theme]);

  const value = {
    theme,
    setTheme: setThemeWithBackend,
    colorTheme,
    setColorTheme: setColorThemeWithBackend,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
