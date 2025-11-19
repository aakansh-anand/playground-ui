"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [sysTheme, setSysTheme] = useState("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSysTheme(mediaQuery.matches ? "dark" : "light");
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const SWITCH_THEME = () => {
    switch (theme) {
      case "light": {
        setTheme("dark");
        return;
      }
      case "dark": {
        setTheme("light");
        return;
      }
      case "system": {
        setTheme(sysTheme === "dark" ? "light" : "dark");
      }
    }
  };
  return (
    <button
      className="absolute flex items-center justify-center top-4 right-4 bg-primary-foreground rounded-sm p-3 size-10 border border-accent"
      onClick={SWITCH_THEME}
    >
      <SunIcon className="absolute size-5 shrink-0 scale-100 dark:scale-0 rotate-0 dark:rotate-45 transition-transform duration-500" />
      <MoonIcon className="absolute size-5 shrink-0 scale-0 dark:scale-100 rotate-45 dark:rotate-0 transition-transform duration-500" />
    </button>
  );
};
