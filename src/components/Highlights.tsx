"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod/v4";
import type { ReactNode } from "react";

// --- Metric ---

const MetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  detail: z.string().optional(),
});

export const Metric = (defineComponent as any)({
  name: "Metric",
  props: MetricSchema,
  description:
    "A sharp numerical fact. value is the big number (e.g. '50%', '3.2M'), label is the headline, detail is optional context.",
  component: ({ props }: { props: { value: string; label: string; detail?: string }; renderNode: (v: unknown) => ReactNode }) => (
    <div
      style={{
        display: "flex",
        gap: "var(--openui-space-m)",
        alignItems: "baseline",
        padding: "var(--openui-space-m) 0",
        borderBottom: "1px solid var(--openui-border-default)",
      }}
    >
      <div
        style={{
          font: "var(--openui-text-heading-sm)",
          letterSpacing: "var(--openui-text-heading-sm-letter-spacing)",
          color: "var(--openui-text-neutral-primary)",
          flexShrink: 0,
          minWidth: 60,
        }}
      >
        {props.value}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            font: "var(--openui-text-label-default)",
            letterSpacing: "var(--openui-text-label-default-letter-spacing)",
            color: "var(--openui-text-neutral-primary)",
          }}
        >
          {props.label}
        </span>
        {props.detail && (
          <span
            style={{
              font: "var(--openui-text-body-sm)",
              letterSpacing: "var(--openui-text-body-sm-letter-spacing)",
              color: "var(--openui-text-neutral-secondary)",
              marginLeft: "var(--openui-space-xs)",
            }}
          >
            {props.detail}
          </span>
        )}
      </div>
    </div>
  ),
});

// --- PullQuote ---

const PullQuoteSchema = z.object({
  quote: z.string(),
});

export const PullQuote = (defineComponent as any)({
  name: "PullQuote",
  props: PullQuoteSchema,
  description:
    "Highlights a short, impactful line. Displays centered with large quotation marks.",
  component: ({ props }: { props: { quote: string }; renderNode: (v: unknown) => ReactNode }) => (
    <div
      style={{
        padding: "var(--openui-space-xl) var(--openui-space-l)",
        textAlign: "center" as const,
        borderTop: "1px solid var(--openui-border-default)",
        borderBottom: "1px solid var(--openui-border-default)",
        margin: "var(--openui-space-l) 0",
      }}
    >
      <div
        style={{
          font: "var(--openui-text-heading-sm)",
          letterSpacing: "var(--openui-text-heading-sm-letter-spacing)",
          color: "var(--openui-text-neutral-secondary)",
          marginBottom: "var(--openui-space-s)",
          lineHeight: 1,
        }}
      >
        &ldquo;&ldquo;
      </div>
      <div
        style={{
          font: "var(--openui-text-body-default)",
          letterSpacing: "var(--openui-text-body-default-letter-spacing)",
          color: "var(--openui-text-neutral-primary)",
          maxWidth: 480,
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        {props.quote}
      </div>
    </div>
  ),
});
