"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { type ReactNode, useState } from "react";

const MeetingSchema = z.object({
  title: z.string(),
  time: z.string(),
  duration: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  needsAction: z.boolean().optional(),
  prepNotes: z.array(z.string()).optional(),
});

const MeetingsBlockSchema = z.object({
  meetings: z.array(MeetingSchema),
  dateLabel: z.string().optional(),
});

type Meeting = z.infer<typeof MeetingSchema>;

function MeetingBottomSheet({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useState(() => { requestAnimationFrame(() => setVisible(true)); });
  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  const actions = [
    { label: "Open in Outlook", icon: "📅" },
    { label: "Reply", icon: "↩" },
    { label: "Forward", icon: "↪" },
  ];

  return (
    <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)", transition: "background 0.3s ease", zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#ffffff", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflow: "auto", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0" }} />
        </div>

        {/* Calendar icon header */}
        <div style={{ padding: "12px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: "#464FEB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📅</div>
          <div style={{ fontSize: 12, color: "#616161" }}>{meeting.type || "Teams Meeting"}</div>
        </div>

        {/* Title */}
        <div style={{ padding: "12px 24px 0" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#242424" }}>{meeting.title}</h3>
        </div>

        {/* Time & Location */}
        <div style={{ padding: "8px 24px 0", fontSize: 14, color: "#616161" }}>
          <div>{meeting.time}{meeting.duration ? ` · ${meeting.duration}` : ""}</div>
          {meeting.location && <div style={{ marginTop: 4 }}>{meeting.location}</div>}
        </div>

        {/* Fake calendar preview */}
        <div style={{ margin: "16px 24px", background: "#f9f9f9", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", padding: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            {["9 AM", "10 AM", "11 AM", "12 PM"].map((t, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: "#999" }}>{t}</div>
                <div style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 4,
                  background: i === 1 || i === 2 ? "rgba(70, 79, 235, 0.15)" : "transparent",
                  border: i === 1 || i === 2 ? "1px solid rgba(70, 79, 235, 0.3)" : "1px solid rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  color: i === 1 || i === 2 ? "#464FEB" : "#ccc",
                  fontWeight: i === 1 || i === 2 ? 600 : 400,
                }}>
                  {i === 1 || i === 2 ? meeting.title.substring(0, 12) + "..." : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prep Notes */}
        {meeting.prepNotes && meeting.prepNotes.length > 0 && (
          <div style={{ padding: "0 24px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#242424", marginBottom: 8 }}>Preparation Notes</div>
            <ul style={{ margin: 0, padding: "0 0 0 20px", listStyle: "disc" }}>
              {meeting.prepNotes.map((note, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: "#424242", marginBottom: 4 }}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Accept/Decline for pending meetings */}
        {meeting.needsAction && (
          <div style={{ padding: "0 24px 16px", display: "flex", gap: 12 }}>
            <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#242424", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              ✓ Accept
            </button>
            <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#616161", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              ✕ Decline
            </button>
          </div>
        )}

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

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPanel(true)}
        style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 4px", cursor: "pointer", borderRadius: 8, transition: "background 0.15s ease" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        {/* Blue left bar */}
        <div style={{ width: 3, minHeight: 40, borderRadius: 2, background: "#464FEB", flexShrink: 0, marginTop: 2 }} />

        {/* Time column */}
        <div style={{ width: 70, flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#242424" }}>{meeting.time}</div>
          {meeting.duration && <div style={{ fontSize: 12, color: "#616161" }}>{meeting.duration}</div>}
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#242424" }}>{meeting.title}</div>
          <div style={{ fontSize: 12, color: "#616161", marginTop: 2 }}>
            {meeting.type || "Teams Meeting"}{meeting.location ? ` · ${meeting.location}` : ""}
          </div>
        </div>
      </div>

      {/* Accept/Decline inline */}
      {meeting.needsAction && (
        <div style={{ display: "flex", gap: 16, padding: "4px 4px 4px 89px", fontSize: 13 }}>
          <span style={{ cursor: "pointer", color: "#242424" }}>✓ Accept</span>
          <span style={{ cursor: "pointer", color: "#616161" }}>✕ Decline</span>
          <span style={{ cursor: "pointer", color: "#999" }}>···</span>
        </div>
      )}

      {showPanel && <MeetingBottomSheet meeting={meeting} onClose={() => setShowPanel(false)} />}
    </>
  );
}

export const MeetingsBlock = defineComponent({
  name: "MeetingsBlock",
  props: MeetingsBlockSchema,
  description: 'Meeting blocks — surfaces calendar meetings inline with blue left bar, time, duration, title, type, and location. Matches M365 Copilot meeting cards. dateLabel is optional header like "Tuesday, January 6". Set needsAction=true to show Accept/Decline buttons. prepNotes is an optional array of strings for meeting prep items. Click a meeting to see calendar preview, prep notes, and actions (Open in Outlook, Reply, Forward).',
  component: ({ props }: { props: z.infer<typeof MeetingsBlockSchema>; renderNode: (v: unknown) => ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
      {props.dateLabel && (
        <div style={{ fontSize: 16, fontWeight: 600, color: "#242424", paddingBottom: 8 }}>{props.dateLabel}</div>
      )}
      {props.meetings.map((meeting, i) => (
        <MeetingCard key={i} meeting={meeting} />
      ))}
    </div>
  ),
});
