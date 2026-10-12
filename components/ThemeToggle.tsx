"use client";

import { useEffect } from "react";

import { useGlobalStore } from "@/store/globalStore";

export default function ThemeToggle() {
  const { gs, set } = useGlobalStore();

  useEffect(() => {
    document.documentElement.dataset.theme = gs.theme;
  }, [gs.theme]);

  const handleThemeToggle = () => {
    set("theme", gs.theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="cursor-pointer px-2 py-2 transition hover:scale-120"
      onClick={handleThemeToggle}
    >
      {gs.theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
