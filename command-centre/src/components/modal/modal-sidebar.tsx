"use client";

import { AlertCircle } from "lucide-react";
import type { Task, OutputFile } from "@/types/task";
import { PanelStats } from "../panel/panel-stats";
import { PanelOutputs } from "../panel/panel-outputs";

export function ModalSidebar({ task, onFileClick }: { task: Task; onFileClick?: (file: OutputFile) => void }) {
  return (
    <div
      style={{
        width: 320,
        backgroundColor: "#F6F3F1",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #EAE8E6",
        flexShrink: 0,
      }}
    >
      {/* Task name and description */}
      <div style={{ padding: "24px 24px 16px 24px" }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "#1B1C1B",
            margin: 0,
          }}
        >
          {task.title}
        </h2>
        {task.description && (
          <p
            style={{
              fontSize: 14,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#5E5E65",
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.5,
            }}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <PanelStats task={task} />

      {/* Spacer */}
      <div style={{ height: 8 }} />

      {/* Outputs */}
      <PanelOutputs taskId={task.id} clientId={task.clientId} onFileClick={onFileClick} />

      {/* Error section */}
      {task.errorMessage && (
        <div
          style={{
            margin: "16px 24px",
            padding: "16px 24px",
            backgroundColor: "#FFF5F3",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <AlertCircle
            size={16}
            color="#C04030"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <span
            style={{
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#C04030",
              lineHeight: 1.4,
            }}
          >
            {task.errorMessage}
          </span>
        </div>
      )}
    </div>
  );
}
