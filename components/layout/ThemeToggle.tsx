"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/lib/utils/icons";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <div className="theme-row" onClick={toggle}>
      <Icon name={isDark ? "Moon" : "Sun"} size={18} />
      <span>{isDark ? "暗色模式" : "亮色模式"}</span>
      <div className={`theme-toggle ${isDark ? "on" : ""}`}>
        <div className="theme-toggle-knob" />
      </div>
    </div>
  );
}
