"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { type ReactNode, useState } from "react";

const FileSchema = z.object({
  name: z.string(),
  author: z.string(),
  updatedTime: z.string().optional(),
  description: z.string().optional(),
  fileType: z.enum(["word", "excel", "powerpoint", "pdf", "generic"]).optional(),
});

const FilesBlockSchema = z.object({
  files: z.array(FileSchema),
  sectionLabel: z.string().optional(),
});

type FileItem = z.infer<typeof FileSchema>;

const fileIcons: Record<string, { bg: string; icon: string }> = {
  word: { bg: "#185ABD", icon: "W" },
  excel: { bg: "#107C41", icon: "X" },
  powerpoint: { bg: "#C43E1C", icon: "P" },
  pdf: { bg: "#D63B3B", icon: "PDF" },
  generic: { bg: "#7B83EB", icon: "📄" },
};

function FileBottomSheet({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const iconInfo = fileIcons[file.fileType || "generic"] || fileIcons.generic;

  useState(() => { requestAnimationFrame(() => setVisible(true)); });

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  const actions = [
    { label: file.fileType === "excel" ? "Open in Excel" : file.fileType === "powerpoint" ? "Open in PowerPoint" : "Open in Word", icon: "📎" },
    { label: "Share", icon: "↗" },
    { label: "Download", icon: "↓" },
  ];

  return (
    <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)", transition: "background 0.3s ease", zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#ffffff", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflow: "auto", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "12px 24px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: iconInfo.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{iconInfo.icon}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#242424" }}>{file.name}</div>
            <div style={{ fontSize: 12, color: "#616161" }}>{file.author}{file.updatedTime ? ` · ${file.updatedTime}` : ""}</div>
          </div>
        </div>

        {/* Description / Preview */}
        {file.description && (
          <div style={{ padding: "0 24px 16px", fontSize: 14, lineHeight: 1.7, color: "#242424" }}>{file.description}</div>
        )}

        {/* Fake preview area */}
        <div style={{ margin: "0 24px 20px", height: 160, background: "#f5f5f5", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, background: iconInfo.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>{iconInfo.icon}</div>
            <div style={{ fontSize: 12, color: "#999" }}>Preview</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "8px 0" }}>
          {actions.map((a, i) => (
            <button key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "14px 24px", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#242424" }}>
              <span>{a.label}</span>
              <span style={{ fontSize: 16, opacity: 0.5 }}>{a.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileCard({ file }: { file: FileItem }) {
  const [showPanel, setShowPanel] = useState(false);
  const iconInfo = fileIcons[file.fileType || "generic"] || fileIcons.generic;

  return (
    <>
      <div
        onClick={() => setShowPanel(true)}
        style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 4px", cursor: "pointer", borderRadius: 8, transition: "background 0.15s ease" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 6, background: iconInfo.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{iconInfo.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#242424", textDecoration: "underline", textDecorationColor: "rgba(0,0,0,0.15)", textUnderlineOffset: 2 }}>{file.name}</div>
          <div style={{ fontSize: 12, color: "#616161", marginTop: 2 }}>{file.author}{file.updatedTime ? ` · ${file.updatedTime}` : ""}</div>
          {file.description && <div style={{ fontSize: 13, color: "#242424", marginTop: 6, lineHeight: 1.5 }}>{file.description}</div>}
        </div>
      </div>
      {showPanel && <FileBottomSheet file={file} onClose={() => setShowPanel(false)} />}
    </>
  );
}

export const FilesBlock = defineComponent({
  name: "FilesBlock",
  props: FilesBlockSchema,
  description: 'File blocks — surfaces key files inline with icon, title, author, update time, and description. fileType controls the icon color (word=blue, excel=green, powerpoint=orange, pdf=red, generic=purple). Click a file to see preview and actions (Open in Word/Excel/PowerPoint, Share, Download). sectionLabel is optional header like "📁 Files".',
  component: ({ props }: { props: z.infer<typeof FilesBlockSchema>; renderNode: (v: unknown) => ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
      {props.sectionLabel && (
        <div style={{ fontSize: 16, fontWeight: 600, color: "#242424", paddingBottom: 8 }}>{props.sectionLabel}</div>
      )}
      {props.files.map((file, i) => (
        <FileCard key={i} file={file} />
      ))}
    </div>
  ),
});
