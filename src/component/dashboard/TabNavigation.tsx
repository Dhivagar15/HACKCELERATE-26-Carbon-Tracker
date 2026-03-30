import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
    icon?: string;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        activeTab === tab.id
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                >
                    <span className="flex items-center gap-2">
                        {tab.icon && <span>{tab.icon}</span>}
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    );
}