"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Plus,
  X,
  Trash2,
  Terminal,
  MessageSquare,
  Pencil,
  Eye,
  History,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import type { PaneItem } from "@/hooks/use-pane-state";
import { MAIN_PANE_ID } from "@/hooks/use-pane-state";
import { useTaskStore } from "@/store/task-store";
import type { Task } from "@/types/task";

interface ChatListProps {
  openPanes: PaneItem[];
  activePaneId: string;
  visiblePaneIds: string[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFocusPane: (paneId: string) => void;
  onFocusMainChat: () => void;
  onRemovePane: (paneId: string) => void;
  onAddToViewport: (paneId: string) => void;
  onRenamePane: (paneId: string, label: string) => void;
  onOpenChat: () => void;
  onOpenTerminal: () => void;
  parentTaskTitle?: string;
  mainTaskId?: string;
  /** Child tasks of the parent — used for the persistent conversation log */
  childTasks?: Task[];
  /** Re-open a child task as a side pane */
  onOpenSubtaskPane?: (taskId: string, label: string) => void;
}

export function ChatList({
  openPanes,
  activePaneId,
  visiblePaneIds,
  collapsed,
  onToggleCollapse,
  onFocusPane,
  onFocusMainChat,
  onRemovePane,
  onAddToViewport,
  onRenamePane,
  onOpenChat,
  onOpenTerminal,
  parentTaskTitle,
  mainTaskId,
  childTasks,
  onOpenSubtaskPane,
}: ChatListProps) {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startRename = useCallback((pane: PaneItem) => {
    setEditingId(pane.id);
    setEditValue(pane.label);
  }, []);

  const commitRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      onRenamePane(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  }, [editingId, editValue, onRenamePane]);

  const visibleSet = new Set(visiblePaneIds);
  const isMainActive = activePaneId === MAIN_PANE_ID;
  const mainTask = mainTaskId ? tasks.find((t) => t.id === mainTaskId) : undefined;
  const mainDone = mainTask?.status === "done";

  // All child tasks that have been executed (not backlog) — persistent conversation log
  const openPaneTaskIds = useMemo(
    () => new Set(openPanes.filter((p) => p.taskId).map((p) => p.taskId!)),
    [openPanes],
  );
  const conversationLog = useMemo(() => {
    if (!childTasks) return [];
    // Only show children that actually had a conversation started (startedAt set).
    // Excludes backlog and auto-queued tasks that never ran.
    return childTasks.filter((t) => t.startedAt);
  }, [childTasks]);

  // Drag start handler for sidebar items
  const handleDragStart = useCallback((e: React.DragEvent, paneId: string) => {
    e.dataTransfer.setData("application/x-pane-id", paneId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  if (collapsed) {
    const logCount = conversationLog.length;
    return (
      <button
        onClick={onToggleCollapse}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 24,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          border: "none",
          borderLeft: "1px solid #EAE8E6",
          background: "#FCFBFA",
          cursor: "pointer",
          color: "#9C9CA0",
          zIndex: 2,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#93452A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#9C9CA0"; }}
      >
        <MessageSquare size={12} style={{ transform: "rotate(-90deg)" }} />
        {logCount > 0 && (
          <span style={{
            fontSize: 8,
            fontWeight: 700,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            backgroundColor: "rgba(147, 69, 42, 0.08)",
            borderRadius: 6,
            padding: "1px 4px",
            lineHeight: 1.2,
          }}>
            {logCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      style={{
        width: 180,
        flexShrink: 0,
        borderLeft: "1px solid #EAE8E6",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FCFBFA",
        overflow: "hidden",
      }}
    >
      {/* Header toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "6px 8px",
          borderBottom: "1px solid #EAE8E6",
        }}
      >
        {/* + button — new chat */}
        <button
          onClick={() => onOpenChat()}
          title="New chat"
          style={{
            width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", background: "transparent", color: "#5E5E65", cursor: "pointer", borderRadius: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <Plus size={14} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Collapse */}
        <button
          onClick={onToggleCollapse}
          style={{
            width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", background: "transparent", color: "#9C9CA0", cursor: "pointer", borderRadius: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Pane list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
        {/* Main chat — same as sub-chats but no trash */}
        <div
          onClick={onFocusMainChat}
          onMouseEnter={() => setHoveredId(MAIN_PANE_ID)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 8px",
            cursor: "pointer",
            borderLeft: isMainActive ? "2px solid #93452A" : "2px solid transparent",
            backgroundColor: isMainActive
              ? "rgba(147, 69, 42, 0.04)"
              : hoveredId === MAIN_PANE_ID ? "rgba(0, 0, 0, 0.02)" : "transparent",
            transition: "all 80ms ease",
          }}
        >
          <MessageSquare size={12} style={{ color: mainDone ? "#BBBBBE" : "#93452A", flexShrink: 0 }} />

          {/* Editable label */}
          {editingId === MAIN_PANE_ID ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                if (editValue.trim()) {
                  updateTask(mainTaskId!, { title: editValue.trim() });
                }
                setEditingId(null);
                setEditValue("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (editValue.trim()) updateTask(mainTaskId!, { title: editValue.trim() });
                  setEditingId(null); setEditValue("");
                }
                if (e.key === "Escape") { setEditingId(null); setEditValue(""); }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1, fontSize: 11,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#1B1C1B", border: "1px solid #93452A", borderRadius: 3,
                padding: "1px 4px", outline: "none", background: "#fff", minWidth: 0,
              }}
            />
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingId(MAIN_PANE_ID);
                setEditValue(parentTaskTitle || "Chat");
              }}
              style={{
                flex: 1, fontSize: 11, fontFamily: "var(--font-inter), Inter, sans-serif",
                color: mainDone ? "#BBBBBE" : isMainActive ? "#1B1C1B" : "#5E5E65",
                fontWeight: isMainActive && !mainDone ? 600 : 400,
                textDecoration: mainDone ? "line-through" : undefined,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {parentTaskTitle || "Chat"}
            </span>
          )}

          {/* Done checkmark */}
          {mainDone && hoveredId !== MAIN_PANE_ID && (
            <CheckCircle2 size={10} style={{ color: "#6B8E6B", flexShrink: 0 }} />
          )}

          {/* Hover actions — edit + mark done + eye (no trash for main) */}
          {hoveredId === MAIN_PANE_ID && editingId !== MAIN_PANE_ID && (
            <div style={{ display: "flex", gap: 2 }}>
              {mainTaskId && (
                <HoverButton
                  title={mainDone ? "Mark not done" : "Mark done"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mainTaskId) {
                      updateTask(mainTaskId, { status: mainDone ? "running" : "done", ...(mainDone ? {} : { needsInput: false }) });
                    }
                  }}
                >
                  <CheckCircle2 size={11} style={mainDone ? { color: "#6B8E6B" } : undefined} />
                </HoverButton>
              )}
              <HoverButton title="Rename" onClick={(e) => {
                e.stopPropagation();
                setEditingId(MAIN_PANE_ID);
                setEditValue(parentTaskTitle || "Chat");
              }}>
                <Pencil size={10} />
              </HoverButton>
              {!visibleSet.has(MAIN_PANE_ID) && visiblePaneIds.length < 4 && (
                <HoverButton title="Add to viewport" onClick={(e) => { e.stopPropagation(); onAddToViewport(MAIN_PANE_ID); }}>
                  <Eye size={11} />
                </HoverButton>
              )}
            </div>
          )}
        </div>

        {/* Separator */}
        {openPanes.length > 0 && (
          <div style={{ height: 1, backgroundColor: "#EAE8E6", margin: "4px 8px" }} />
        )}

        {openPanes.map((pane) => {
          const isActive = activePaneId === pane.id;
          const isVisible = visibleSet.has(pane.id);
          const viewportIndex = isVisible ? visiblePaneIds.indexOf(pane.id) : -1;
          const isHovered = hoveredId === pane.id;
          const isEditing = editingId === pane.id;
          const Icon = pane.type === "terminal" ? Terminal : MessageSquare;
          const iconColor = pane.type === "terminal" ? "#6B8E6B" : "#93452A";
          const paneTask = pane.taskId ? tasks.find((t) => t.id === pane.taskId) : undefined;
          const paneDone = paneTask?.status === "done";
          const statusRunning = paneTask?.status === "running" || paneTask?.status === "queued";
          // Claude is waiting for input if: needsInput flag, activity ends with "?", or status is review
          const isWaiting = paneTask?.needsInput === true
            || paneTask?.status === "review"
            || (paneTask?.status === "running" && !!paneTask?.activityLabel?.trimEnd().endsWith("?"));
          // Actively running = status says running but NOT waiting for input
          const isRunning = statusRunning && !isWaiting;
          // Notification dot: only show when task needs input AND pane is not active (user isn't looking at it)
          const needsReply = !isActive && (paneTask?.needsInput === true);

          return (
            <div
              key={pane.id}
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, pane.id)}
              onMouseEnter={() => setHoveredId(pane.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                onFocusPane(pane.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 8px",
                cursor: isEditing ? "text" : "grab",
                borderLeft: isActive
                  ? `2px solid ${isRunning && !needsReply ? "#6366F1" : "#93452A"}`
                  : isRunning && !needsReply
                  ? "2px solid rgba(99, 102, 241, 0.4)"
                  : "2px solid transparent",
                backgroundColor: isActive
                  ? "rgba(147, 69, 42, 0.04)"
                  : isHovered ? "rgba(0, 0, 0, 0.02)" : "transparent",
                animation: isRunning && !needsReply
                  ? "row-running-pulse 2.5s ease-in-out infinite"
                  : undefined,
                opacity: isVisible ? 1 : 0.6,
                transition: "border-color 80ms ease",
              }}
            >
              <Icon size={12} style={{ color: iconColor, flexShrink: 0 }} />

              {/* Viewport position number */}
              {viewportIndex >= 0 && (
                <span style={{
                  width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#93452A", backgroundColor: "rgba(147, 69, 42, 0.08)",
                  borderRadius: 3, flexShrink: 0,
                }}>
                  {viewportIndex + 1}
                </span>
              )}

              {/* Label */}
              {isEditing ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") { setEditingId(null); setEditValue(""); }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1, fontSize: 11,
                    fontFamily: pane.type === "terminal" ? "'DM Mono', monospace" : "var(--font-inter), Inter, sans-serif",
                    color: "#1B1C1B", border: "1px solid #93452A", borderRadius: 3,
                    padding: "1px 4px", outline: "none", background: "#fff", minWidth: 0,
                  }}
                />
              ) : (
                <span
                  onDoubleClick={(e) => { e.stopPropagation(); startRename(pane); }}
                  style={{
                    flex: 1, fontSize: 11,
                    fontFamily: pane.type === "terminal" ? "'DM Mono', monospace" : "var(--font-inter), Inter, sans-serif",
                    color: paneDone ? "#BBBBBE" : isActive ? "#1B1C1B" : "#5E5E65",
                    fontWeight: isActive && !paneDone ? 600 : 400,
                    textDecoration: paneDone ? "line-through" : undefined,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}
                >
                  {pane.label}
                </span>
              )}

              {/* Done checkmark */}
              {paneDone && !isHovered && (
                <CheckCircle2 size={10} style={{ color: "#6B8E6B", flexShrink: 0 }} />
              )}

              {/* Pulsing dots when Claude is running */}
              {isRunning && !needsReply && !paneDone && !isHovered && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#6366F1",
                  letterSpacing: 1, flexShrink: 0,
                  animation: "ellipsis-pulse 1.4s ease-in-out infinite",
                }}>
                  ...
                </span>
              )}

              {/* Solid dot when needs reply */}
              {needsReply && !paneDone && !isHovered && (
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  backgroundColor: "#93452A", flexShrink: 0,
                }} />
              )}

              {/* Hover actions */}
              {isHovered && !isEditing && (
                <div style={{ display: "flex", gap: 2 }}>
                  {/* Mark as done / undone */}
                  {paneTask && (
                    <HoverButton
                      title={paneDone ? "Mark not done" : "Mark done"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTask(paneTask.id, {
                          status: paneDone ? "running" : "done",
                          ...(paneDone ? {} : { needsInput: false, errorMessage: null, completedAt: new Date().toISOString() }),
                        });
                      }}
                    >
                      <CheckCircle2 size={11} style={paneDone ? { color: "#6B8E6B" } : undefined} />
                    </HoverButton>
                  )}

                  {/* Preview / Add to viewport */}
                  {!isVisible && visiblePaneIds.length < 4 && (
                    <HoverButton title="Preview" onClick={(e) => { e.stopPropagation(); onAddToViewport(pane.id); }}>
                      <Eye size={11} />
                    </HoverButton>
                  )}

                  <HoverButton title="Remove" onClick={(e) => { e.stopPropagation(); onRemovePane(pane.id); }} danger>
                    <Trash2 size={11} />
                  </HoverButton>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conversation log — ALL child tasks that have been executed, including active ones */}
      {conversationLog.length > 0 && (
        <div style={{ flexShrink: 0, borderTop: "1px solid #EAE8E6" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 8px 4px",
          }}>
            <History size={10} style={{ color: "#9C9CA0" }} />
            <span style={{
              fontSize: 9,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontWeight: 600,
              color: "#9C9CA0",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              Conversations
            </span>
          </div>
          <div style={{ overflowY: "auto", maxHeight: 220 }}>
            {conversationLog.map((child) => {
              const hasPane = openPaneTaskIds.has(child.id);
              const childDone = child.status === "done";
              const statusColor = childDone ? "#6B8E6B"
                : child.status === "running" || child.status === "queued" ? "#6366F1"
                : child.status === "review" ? "#B25D3F"
                : "#9C9CA0";
              const isLogHovered = hoveredId === `log-${child.id}`;
              return (
                <div
                  key={child.id}
                  onClick={() => {
                    if (onOpenSubtaskPane) onOpenSubtaskPane(child.id, child.title);
                  }}
                  onMouseEnter={(e) => {
                    setHoveredId(`log-${child.id}`);
                    e.currentTarget.style.backgroundColor = hasPane ? "rgba(147, 69, 42, 0.05)" : "rgba(0, 0, 0, 0.02)";
                  }}
                  onMouseLeave={(e) => {
                    setHoveredId(null);
                    e.currentTarget.style.backgroundColor = hasPane ? "rgba(147, 69, 42, 0.02)" : "transparent";
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 6,
                    padding: "4px 8px",
                    cursor: onOpenSubtaskPane ? "pointer" : "default",
                    backgroundColor: hasPane ? "rgba(147, 69, 42, 0.02)" : "transparent",
                    transition: "background 80ms ease",
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    backgroundColor: statusColor, flexShrink: 0, marginTop: 4,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 10,
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      color: childDone ? "#BBBBBE" : hasPane ? "#1B1C1B" : "#5E5E65",
                      fontWeight: hasPane ? 500 : 400,
                      textDecoration: childDone ? "line-through" : undefined,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {child.title}
                    </div>
                    <div style={{
                      fontSize: 9,
                      fontFamily: "'DM Mono', monospace",
                      color: "#BBBBBE",
                      marginTop: 1,
                    }}>
                      {child.id.slice(0, 8)}
                      {child.activityLabel ? ` · ${child.activityLabel.slice(0, 30)}` : ""}
                    </div>
                  </div>
                  {/* Done/reopen toggle on hover */}
                  {isLogHovered ? (
                    <HoverButton
                      title={childDone ? "Reopen" : "Mark done"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTask(child.id, {
                          status: childDone ? "queued" : "done",
                          ...(childDone ? {} : { needsInput: false, errorMessage: null, completedAt: new Date().toISOString() }),
                        });
                      }}
                    >
                      <CheckCircle2 size={11} style={childDone ? { color: "#6B8E6B" } : undefined} />
                    </HoverButton>
                  ) : childDone ? (
                    <CheckCircle2 size={9} style={{ color: "#6B8E6B", flexShrink: 0, marginTop: 3 }} />
                  ) : hasPane ? (
                    <MessageSquare size={9} style={{ color: "#93452A", flexShrink: 0, marginTop: 3 }} />
                  ) : onOpenSubtaskPane ? (
                    <ExternalLink size={9} style={{ color: "#BBBBBE", flexShrink: 0, marginTop: 3 }} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes ellipsis-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes row-running-pulse {
          0%, 100% { background-color: rgba(99, 102, 241, 0.06); }
          50% { background-color: rgba(99, 102, 241, 0.14); }
        }
      `}</style>
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function HoverButton({ title, onClick, danger, children }: {
  title: string; onClick: (e: React.MouseEvent) => void; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
        border: "none", background: "transparent", color: "#9C9CA0",
        cursor: "pointer", borderRadius: 3,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = danger ? "#DC2626" : "#93452A"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#9C9CA0"; }}
    >
      {children}
    </button>
  );
}
