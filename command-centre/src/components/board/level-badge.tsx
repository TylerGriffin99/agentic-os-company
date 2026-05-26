"use client";

import type { TaskLevel } from "@/types/task";
import { LEVEL_LABELS } from "@/lib/levels";

const levelConfig: Record<
  TaskLevel,
  { bg: string; text: string }
> = {
  task: {
    bg: "#EAE8E6",
    text: "#5E5E65",
  },
  project: {
    bg: "#EAE8E6",
    text: "#5E5E65",
  },
  gsd: {
    bg: "#EAE8E6",
    text: "#5E5E65",
  },
};

export function LevelBadge({ level, projectSlug }: { level: TaskLevel; projectSlug?: string | null }) {
  const config = levelConfig[level];
  const label = projectSlug
    ? projectSlug.replace(/-/g, " ")
    : LEVEL_LABELS[level];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        padding: "2px 8px",
        borderRadius: 4,
        backgroundColor: config.bg,
        color: config.text,
        lineHeight: "16px",
        maxWidth: 200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
