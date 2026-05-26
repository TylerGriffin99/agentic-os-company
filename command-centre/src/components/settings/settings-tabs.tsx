"use client";

import { Terminal, KeyRound, Plug, FileCode } from "lucide-react";
import type { ComponentType } from "react";

interface Tab {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

const tabs: Tab[] = [
  { id: "scripts", label: "Scripts", icon: Terminal },
  { id: "env", label: "Environment", icon: KeyRound },
  { id: "mcp", label: "MCP", icon: Plug },
  { id: "claude", label: "Claude Settings", icon: FileCode },
];

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
        padding: "0 24px",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: isActive ? "#93452A" : "#5E5E65",
              borderBottom: isActive
                ? "2px solid #93452A"
                : "2px solid transparent",
              transition: "color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "#1B1C1B";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "#5E5E65";
              }
            }}
          >
            <Icon size={16} />
            <span style={{ marginLeft: 8 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
