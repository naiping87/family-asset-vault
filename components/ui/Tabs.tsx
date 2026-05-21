import { cn } from "@/lib/utils/cn";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("tabs", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={cn("tab", activeTab === tab.key && "active")}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
