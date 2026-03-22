"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod/v4";

// --- Schema ---

const TimelineEventSchema = z.object({
  marker: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

const TimelineSchema = z.object({
  events: z.array(TimelineEventSchema),
});

// --- Component ---

export const Timeline = defineComponent({
  name: "Timeline",
  props: TimelineSchema as any,
  description:
    'A chronological view showing how events or milestones unfold over time. Each event has a marker (year/date), a bold title, and optional description. Events are displayed vertically with a connecting line.',
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        paddingLeft: 24,
        width: "100%",
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          left: 5,
          top: 8,
          bottom: 8,
          width: 2,
          background: "var(--openui-border-interactive)",
        }}
      />
      {props.events.map((event: any, i: number) => (
        <div
          key={i}
          style={{
            position: "relative",
            paddingBottom:
              i < props.events.length - 1 ? "var(--openui-space-xl)" : 0,
          }}
        >
          {/* Dot */}
          <div
            style={{
              position: "absolute",
              left: -24 + 1,
              top: 6,
              width: 10,
              height: 10,
              borderRadius: "var(--openui-radius-full)",
              background: "var(--openui-interactive-accent-default)",
              border: "2px solid var(--openui-background)",
              boxSizing: "border-box",
            }}
          />
          {/* Marker */}
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
          {/* Title */}
          <div
            style={{
              font: "var(--openui-text-label-default)",
              letterSpacing: "var(--openui-text-label-default-letter-spacing)",
              color: "var(--openui-text-neutral-primary)",
            }}
          >
            {event.title}
          </div>
          {/* Description */}
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
