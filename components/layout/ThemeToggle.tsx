"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/provider";
import { Icon } from "@/lib/utils/icons";

export function ThemeToggle() {
  const { t } = useT();
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
      <span>{isDark ? t("theme.dark") : t("theme.light")}</span>
      <div className={`theme-toggle ${isDark ? "on" : ""}`}>
        <div className="theme-toggle-knob" />
      </div>
    </div>
  );
}
