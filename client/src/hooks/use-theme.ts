import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: typeof window !== "undefined" ? 
    (document.documentElement.classList.contains("dark") ? "dark" : "light") : 
    "light",
  setTheme: (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },
}));

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  return { theme, setTheme };
}
