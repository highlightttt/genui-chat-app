"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { type ReactNode, useState, useEffect } from "react";

const PersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  reportsTo: z.string().optional(),
  reportsToRole: z.string().optional(),
  reportsToAvatarUrl: z.string().optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
});

const PeopleBlockSchema = z.object({
  people: z.array(PersonSchema),
  groupLabel: z.string().optional(),
});

type Person = z.infer<typeof PersonSchema>;

function getAvatarUrl(name: string): string {
  // Always use randomuser.me portraits — deterministic by hashing name
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  const num = Math.abs(hash) % 100;
  const gender = num % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
}

function PersonBottomSheet({ person, onClose }: { person: Person; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-up animation
    requestAnimationFrame(() => setVisible(true));
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        transition: "background 0.3s ease",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "20px 20px 0 0",
          maxHeight: "75vh",
          overflow: "auto",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          position: "relative",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0" }} />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "rgba(0,0,0,0.06)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#616161",
            zIndex: 1,
          }}
        >
          ✕
        </button>

        {/* Cover photo — full width hero image */}
        <div style={{
          width: "100%",
          height: 280,
          overflow: "hidden",
          position: "relative",
          borderRadius: "20px 20px 0 0",
        }}>
          <img
            src={getAvatarUrl(person.name)}
            alt={person.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px 32px" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#242424" }}>
            {person.name}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#616161" }}>
            {person.role}
          </p>

          {/* Bio */}
          {(person.bio || person.description) && (
            <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.7, color: "#242424" }}>
              {person.bio || person.description}
            </p>
          )}

          {/* Reports to */}
          {person.reportsTo && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600, color: "#242424" }}>
                Reports to
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={getAvatarUrl(person.reportsTo)}
                  alt={person.reportsTo}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#242424" }}>
                    {person.reportsTo}
                  </div>
                  {person.reportsToRole && (
                    <div style={{ fontSize: 12, color: "#616161" }}>
                      {person.reportsToRole}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Key Projects */}
          {person.projects && person.projects.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600, color: "#242424" }}>
                Key Projects
              </h3>
              <ul style={{ margin: 0, padding: "0 0 0 20px", listStyle: "disc" }}>
                {person.projects.map((p, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#242424", marginBottom: 8 }}>
                    <strong>{p.name}</strong>
                    {p.description && <span> — {p.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPanel(true)}
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          padding: "10px 4px",
          cursor: "pointer",
          borderRadius: 8,
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <img
          src={getAvatarUrl(person.name)}
          alt={person.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              font: "var(--openui-text-label-default)",
              letterSpacing: "var(--openui-text-label-default-letter-spacing)",
              color: "var(--openui-text-neutral-primary)",
              textDecoration: "underline",
              textDecorationColor: "rgba(0,0,0,0.15)",
              textUnderlineOffset: 2,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              font: "var(--openui-text-body-sm)",
              letterSpacing: "var(--openui-text-body-sm-letter-spacing)",
              color: "var(--openui-text-neutral-secondary)",
            }}
          >
            {person.role}
          </div>
          {person.description && (
            <div
              style={{
                font: "var(--openui-text-body-sm)",
                letterSpacing: "var(--openui-text-body-sm-letter-spacing)",
                color: "var(--openui-text-neutral-tertiary)",
                marginTop: 2,
              }}
            >
              {person.description}
            </div>
          )}
        </div>
      </div>
      {showPanel && <PersonBottomSheet person={person} onClose={() => setShowPanel(false)} />}
    </>
  );
}

export const PeopleBlock = defineComponent({
  name: "PeopleBlock",
  props: PeopleBlockSchema,
  description:
    'People block — surfaces key individuals with avatar, name, role, and optional description. groupLabel is an optional section header like "Design Lead". Optional fields: bio (detailed bio shown in profile panel), reportsTo/reportsToRole (manager info), projects (array of {name, description} for key projects). Click a person to see their full profile in a slide-up panel.',
  component: ({ props }: { props: z.infer<typeof PeopleBlockSchema>; renderNode: (v: unknown) => ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, width: "100%" }}>
      {props.groupLabel && (
        <div
          style={{
            font: "var(--openui-text-heading-xs)",
            letterSpacing: "var(--openui-text-heading-xs-letter-spacing)",
            color: "var(--openui-text-neutral-primary)",
            paddingBottom: 8,
          }}
        >
          {props.groupLabel}
        </div>
      )}
      {props.people.map((person, i) => (
        <PersonCard key={i} person={person} />
      ))}
    </div>
  ),
});
