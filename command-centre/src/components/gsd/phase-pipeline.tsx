"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { GsdPhase, PhaseStatus } from "@/types/gsd";

const statusConfig: Record<PhaseStatus, { color: string; bg: string; border: string; label: string }> = {
  complete: { color: "#6B8E6B", bg: "#F0F7F0", border: "#6B8E6B", label: "Complete" },
  "in-progress": { color: "#93452A", bg: "#FFF8F5", border: "#93452A", label: "In Progress" },
  "not-started": { color: "#9C9CA0", bg: "#FAFAFA", border: "#E5E5E5", label: "Not Started" },
};

interface PhasePipelineProps {
  phases: GsdPhase[];
  selectedPhase: number | null;
  onSelectPhase: (num: number) => void;
}

export function PhasePipeline({ phases, selectedPhase, onSelectPhase }: PhasePipelineProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        padding: "4px 0",
      }}
    >
      {phases.map((phase, i) => {
        const config = statusConfig[phase.status];
        const isSelected = selectedPhase === phase.number;

        return (
          <div key={phase.number} style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => onSelectPhase(phase.number)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "12px 16px",
                minWidth: 160,
                border: isSelected ? `2px solid ${config.border}` : "1px solid rgba(218, 193, 185, 0.2)",
                borderRadius: 8,
                backgroundColor: isSelected ? config.bg : "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 150ms ease",
                boxShadow: isSelected ? `0 2px 8px rgba(147, 69, 42, 0.08)` : "none",
              }}
            >
              {/* Phase number + status icon */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: config.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Phase {phase.number}
                </span>
                {phase.status === "complete" && <CheckCircle2 size={14} style={{ color: "#6B8E6B" }} />}
                {phase.status === "in-progress" && (
                  <Loader2
                    size={14}
                    style={{ color: "#93452A", animation: "spin 2s linear infinite" }}
                  />
                )}
                {phase.status === "not-started" && <Circle size={14} style={{ color: "#D1D5DB" }} />}
              </div>

              {/* Name */}
              <span
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#1B1C1B",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {phase.name}
              </span>

              {/* Plan progress */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    backgroundColor: "#EAE8E6",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${phase.plansTotal > 0 ? (phase.plansComplete / phase.plansTotal) * 100 : 0}%`,
                      background: phase.status === "complete"
                        ? "#6B8E6B"
                        : "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
                      borderRadius: 2,
                      transition: "width 300ms ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 11,
                    color: "#5E5E65",
                    whiteSpace: "nowrap",
                  }}
                >
                  {phase.plansComplete}/{phase.plansTotal}
                </span>
              </div>
            </button>

            {/* Connector arrow */}
            {i < phases.length - 1 && (
              <div
                style={{
                  width: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D1D5DB",
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                &#8594;
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
