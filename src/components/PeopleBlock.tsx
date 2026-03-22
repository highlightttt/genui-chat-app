"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod/v4";

// --- Schema ---

const PersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const PeopleBlockSchema = z.object({
  people: z.array(PersonSchema),
  groupLabel: z.string().optional(),
});

// --- Component ---

function PersonCard({ person }: { person: z.infer<typeof PersonSchema> }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--openui-space-m)",
        alignItems: "flex-start",
        padding: "var(--openui-space-m) 0",
      }}
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
          <img
            src={person.avatarUrl}
            alt={person.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          person.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: "var(--openui-text-label-default)",
            letterSpacing: "var(--openui-text-label-default-letter-spacing)",
            color: "var(--openui-text-neutral-primary)",
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
  );
}

export const PeopleBlock = defineComponent({
  name: "PeopleBlock",
  props: PeopleBlockSchema as any,
  description:
    'People block — surfaces key individuals with avatar, name, role, and optional description. Use when showing who\'s involved (team members, owners, contacts). groupLabel is an optional section header like "Design Lead" or "Core Engineers".',
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
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
      {props.people.map((person: any, i: number) => (
        <PersonCard key={i} person={person} />
      ))}
    </div>
  ),
});
