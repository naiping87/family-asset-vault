"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/provider";
import { Icon } from "@/lib/utils/icons";

interface Props {
  compact?: boolean;
}

export function ThemeToggle({ compact }: Props) {
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

  if (compact) {
    return (
      <button
        className="btn btn-secondary btn-icon"
        onClick={toggle}
        type="button"
        aria-label={isDark ? t("theme.light") : t("theme.dark")}
        style={{ width: 36, height: 36 }}
      >
        <Icon name={isDark ? "Sun" : "Moon"} size={18} />
      </button>
    );
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
