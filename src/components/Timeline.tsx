"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod/v4";
import type { ReactNode } from "react";

const TimelineEventSchema = z.object({
  marker: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

const TimelineSchema = z.object({
  events: z.array(TimelineEventSchema),
});

type TimelineEvent = { marker: string; title: string; description?: string };

export const Timeline = (defineComponent as any)({
  name: "Timeline",
  props: TimelineSchema,
  description:
    "Chronological view with vertical line and dots. Each event has marker (year/date), title, and optional description.",
  component: ({ props }: { props: { events: TimelineEvent[] }; renderNode: (v: unknown) => ReactNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        paddingLeft: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute" as const,
          left: 5,
          top: 8,
          bottom: 8,
          width: 2,
          background: "var(--openui-border-interactive)",
        }}
      />
      {props.events.map((event: TimelineEvent, i: number) => (
        <div
          key={i}
          style={{
            position: "relative" as const,
            paddingBottom:
              i < props.events.length - 1 ? "var(--openui-space-xl)" : "0",
          }}
        >
          <div
            style={{
              position: "absolute" as const,
              left: -24 + 1,
              top: 6,
              width: 10,
              height: 10,
              borderRadius: "var(--openui-radius-full)",
              background: "var(--openui-interactive-accent-default)",
              border: "2px solid var(--openui-background)",
              boxSizing: "border-box" as const,
            }}
          />
          <div
            style={{
              font: "var(--openui-text-label-sm)",
              letterSpacing: "var(--openui-text-label-sm-letter-spacing)",
              color: "var(--openui-text-neutral-secondary)",
              marginBottom: "var(--openui-space-3xs)",
            }}
          >
            {event.marker}
          </div>
          <div
            style={{
              font: "var(--openui-text-label-default)",
              letterSpacing: "var(--openui-text-label-default-letter-spacing)",
              color: "var(--openui-text-neutral-primary)",
            }}
          >
            {event.title}
          </div>
          {event.description && (
            <div
              style={{
                font: "var(--openui-text-body-sm)",
                letterSpacing: "var(--openui-text-body-sm-letter-spacing)",
                color: "var(--openui-text-neutral-tertiary)",
                marginTop: "var(--openui-space-2xs)",
              }}
            >
              {event.description}
            </div>
          )}
        </div>
      ))}
    </div>
  ),
});
