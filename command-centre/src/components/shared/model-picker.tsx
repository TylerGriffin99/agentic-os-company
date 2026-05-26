"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import type { ClaudeModel } from "@/types/task";

interface Option {
  value: ClaudeModel;
  label: string;
}

const OPTIONS: Option[] = [
  { value: "opus", label: "Opus" },
  { value: "sonnet", label: "Sonnet" },
  { value: "haiku", label: "Haiku" },
];

interface ModelPickerProps {
  value: ClaudeModel | null;
  onChange: (value: ClaudeModel) => void;
  disabled?: boolean;
}

export function ModelPicker({ value, onChange, disabled }: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current: ClaudeModel = value ?? "opus";
  const currentLabel = OPTIONS.find((o) => o.value === current)?.label || "Opus";

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        title="Model"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          height: 26,
          padding: "0 8px",
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: "#5E5E65",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <Sparkles size={13} />
        {currentLabel}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: "100%",
            marginBottom: 6,
            backgroundColor: "#f3f0ee",
            border: "1px solid #e5e1dc",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
            zIndex: 60,
            minWidth: 140,
            padding: 6,
          }}
        >
          <div
            style={{
              padding: "4px 10px 8px",
              fontSize: 13,
              fontWeight: 600,
              color: "#5E5E65",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            }}
          >
            Model
          </div>
          {OPTIONS.map((opt) => {
            const isSelected = opt.value === current;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#1B1C1B",
                  backgroundColor: isSelected ? "rgba(0,0,0,0.05)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? "rgba(0,0,0,0.05)" : "transparent";
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
