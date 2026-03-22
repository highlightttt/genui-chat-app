"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { type ReactNode, useState } from "react";

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

function PersonModal({ person, onClose }: { person: Person; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 16,
          maxWidth: 420,
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.06)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#616161",
            zIndex: 1,
          }}
        >
          ✕
        </button>

        {/* Header with avatar */}
        <div style={{ padding: "32px 24px 0", textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#f0f0f0",
              border: "2px solid rgba(0,0,0,0.06)",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: 28,
              color: "#616161",
              fontWeight: 300,
            }}
          >
            {person.avatarUrl ? (
              <img src={person.avatarUrl} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              person.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
            )}
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#242424" }}>{person.name}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#616161" }}>{person.role}</p>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px 24px" }}>
          {/* Bio / Description */}
          {(person.bio || person.description) && (
            <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.6, color: "#242424" }}>
              {person.bio || person.description}
            </p>
          )}

          {/* Reports to */}
          {person.reportsTo && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: "#242424" }}>Reports to</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    fontSize: 14,
                    color: "#616161",
                    flexShrink: 0,
                  }}
                >
                  {person.reportsToAvatarUrl ? (
                    <img src={person.reportsToAvatarUrl} alt={person.reportsTo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    person.reportsTo.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#242424" }}>{person.reportsTo}</div>
                  {person.reportsToRole && <div style={{ fontSize: 12, color: "#616161" }}>{person.reportsToRole}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Key Projects */}
          {person.projects && person.projects.length > 0 && (
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: "#242424" }}>Key Projects</h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px", listStyle: "disc" }}>
                {person.projects.map((p, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#242424", marginBottom: 6 }}>
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
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          display: "flex",
          gap: "var(--openui-space-m)",
          alignItems: "flex-start",
          padding: "var(--openui-space-m) 0",
          cursor: "pointer",
          borderRadius: 8,
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--openui-radius-full)",
            background: "var(--openui-sunk)",
            border: "1px solid var(--openui-border-default)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            font: "var(--openui-text-body-sm)",
            color: "var(--openui-text-neutral-secondary)",
          }}
        >
          {person.avatarUrl ? (
            <img src={person.avatarUrl} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" as const }} />
          ) : (
            person.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
          )}
        </div>
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
                marginTop: "var(--openui-space-2xs)",
              }}
            >
              {person.description}
            </div>
          )}
        </div>
      </div>
      {showModal && <PersonModal person={person} onClose={() => setShowModal(false)} />}
    </>
  );
}

export const PeopleBlock = defineComponent({
  name: "PeopleBlock",
  props: PeopleBlockSchema,
  description:
    'People block — surfaces key individuals with avatar, name, role, and optional description. groupLabel is an optional section header like "Design Lead". Optional fields: bio (detailed bio shown in modal), reportsTo/reportsToRole (manager info), projects (array of {name, description} for key projects). Click a person to see their full profile.',
  component: ({ props }: { props: z.infer<typeof PeopleBlockSchema>; renderNode: (v: unknown) => ReactNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        gap: 0,
        width: "100%",
      }}
    >
      {props.groupLabel && (
        <div
          style={{
            font: "var(--openui-text-heading-xs)",
            letterSpacing: "var(--openui-text-heading-xs-letter-spacing)",
            color: "var(--openui-text-neutral-primary)",
            paddingBottom: "var(--openui-space-xs)",
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
