"use client";

import Link from "next/link";
import { Cpu, Clock, Palette, ArrowRight } from "lucide-react";
import type { DashboardSummary } from "@/types/dashboard";

interface SystemHealthProps {
  system: DashboardSummary["system"];
}

export function SystemHealth({ system }: SystemHealthProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <Cpu size={16} color="#93452A" />
        <span style={labelStyle}>System Health</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Cron */}
        <Link href="/cron" style={linkRowStyle}>
          <Clock size={14} color="#5E5E65" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={statValueStyle}>
              {system.cronActive > 0
                ? `${system.cronActive} scheduled task${system.cronActive !== 1 ? "s" : ""} active`
                : "No scheduled tasks configured"}
            </div>
            {system.cronLastRun && (
              <div style={statDetailStyle}>
                Last: {system.cronLastRun.jobName} — {system.cronLastRun.result}
              </div>
            )}
          </div>
          <ArrowRight size={12} color="#9C9CA0" style={{ flexShrink: 0 }} />
        </Link>

        {/* Skills */}
        <Link href="/skills" style={linkRowStyle}>
          <Cpu size={14} color="#5E5E65" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={statValueStyle}>
              {system.skillsInstalled} skill{system.skillsInstalled !== 1 ? "s" : ""} installed
            </div>
          </div>
          <ArrowRight size={12} color="#9C9CA0" style={{ flexShrink: 0 }} />
        </Link>

        {/* Brand context */}
        <Link href="/?tab=docs" style={linkRowStyle}>
          <Palette size={14} color="#5E5E65" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={statValueStyle}>
              {system.brandContextFiles} brand context file{system.brandContextFiles !== 1 ? "s" : ""}
            </div>
          </div>
          <ArrowRight size={12} color="#9C9CA0" style={{ flexShrink: 0 }} />
        </Link>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#F6F3F1",
  borderRadius: 12,
  padding: "20px 24px",
  flex: 1,
  minWidth: 0,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5E5E65",
};

const linkRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  textDecoration: "none",
  color: "inherit",
  borderRadius: 8,
  padding: "6px 8px",
  margin: "-6px -8px",
  transition: "background-color 150ms ease",
};

const statValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: "#1B1C1B",
};

const statDetailStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 12,
  color: "#9C9CA0",
  marginTop: 2,
};
