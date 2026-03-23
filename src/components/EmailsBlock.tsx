"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { type ReactNode, useState } from "react";

const EmailSchema = z.object({
  subject: z.string(),
  sender: z.string(),
  senderRole: z.string().optional(),
  time: z.string().optional(),
  summary: z.string().optional(),
  isRead: z.boolean().optional(),
});

const EmailsBlockSchema = z.object({
  emails: z.array(EmailSchema),
  sectionLabel: z.string().optional(),
});

type Email = z.infer<typeof EmailSchema>;

function getAvatarUrl(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  const num = Math.abs(hash) % 100;
  const gender = num % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
}

function EmailBottomSheet({ email, onClose }: { email: Email; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useState(() => { requestAnimationFrame(() => setVisible(true)); });
  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  const actions = [
    { label: "Open in Outlook", icon: "📧" },
    { label: "Share", icon: "↗" },
  ];

  return (
    <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)", transition: "background 0.3s ease", zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#ffffff", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflow: "auto", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "12px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 20, height: 20, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✉️</div>
          <div style={{ fontSize: 12, color: "#616161" }}>{email.sender}{email.time ? ` · ${email.time}` : ""}</div>
        </div>

        {/* Subject */}
        <div style={{ padding: "12px 24px 0" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#242424" }}>{email.subject}</h3>
        </div>

        {/* Summary as body preview */}
        {email.summary && (
          <div style={{ padding: "12px 24px 20px", fontSize: 14, lineHeight: 1.7, color: "#424242" }}>
            {email.summary}
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

function EmailCard({ email }: { email: Email }) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPanel(true)}
        style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 4px", cursor: "pointer", borderRadius: 8, transition: "background 0.15s ease" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <img
          src={getAvatarUrl(email.sender)}
          alt={email.sender}
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 14, fontWeight: email.isRead === false ? 700 : 600, color: "#242424" }}>{email.subject}</div>
          </div>
          <div style={{ fontSize: 12, color: "#616161", marginTop: 1 }}>
            {email.sender}{email.time ? `, ${email.time}` : ""}
          </div>
          {email.summary && (
            <div style={{ fontSize: 13, color: "#424242", marginTop: 6, lineHeight: 1.5 }}>{email.summary}</div>
          )}
        </div>
      </div>
      {showPanel && <EmailBottomSheet email={email} onClose={() => setShowPanel(false)} />}
    </>
  );
}

export const EmailsBlock = defineComponent({
  name: "EmailsBlock",
  props: EmailsBlockSchema,
  description: 'Email blocks — surfaces key emails inline with sender avatar, subject, sender name, time, and summary. Intended for awareness and triage. Click an email to see full preview and actions (Open in Outlook, Share). sectionLabel is optional header like "📬 Top Emails". Set isRead=false for bold unread styling.',
  component: ({ props }: { props: z.infer<typeof EmailsBlockSchema>; renderNode: (v: unknown) => ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
      {props.sectionLabel && (
        <div style={{ fontSize: 16, fontWeight: 600, color: "#242424", paddingBottom: 8 }}>{props.sectionLabel}</div>
      )}
      {props.emails.map((email, i) => (
        <EmailCard key={i} email={email} />
      ))}
    </div>
  ),
});
