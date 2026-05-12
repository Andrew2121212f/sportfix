"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, useCallback, useRef } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("fs-theme") as Theme) || "dark";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const listeners = useRef(new Set<() => void>());
  const themeRef = useRef<Theme>(getStoredTheme());

  const subscribe = useCallback((cb: () => void) => {
    listeners.current.add(cb);
    return () => { listeners.current.delete(cb); };
  }, []);

  const getSnapshot = useCallback(() => themeRef.current, []);
  const getServerSnapshot = useCallback((): Theme => "dark", []);

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    themeRef.current = next;
    localStorage.setItem("fs-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    listeners.current.forEach((cb) => cb());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
