"use client";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod/v4";

// --- Metric ---

const MetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  detail: z.string().optional(),
});

const MetricItem = defineComponent({
  name: "Metric",
  props: MetricSchema as any,
  description:
    "A sharp numerical fact that quantifies performance, scale, or impact. value is the big number (e.g. '50%', '3.2M'), label is the headline, detail is optional context.",
  component: ({ props }) => (
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

const PullQuote = defineComponent({
  name: "PullQuote",
  props: PullQuoteSchema as any,
  description:
    "Highlights a short, impactful line by visually separating it from the main body text. Displays with large quotation marks and centered text.",
  component: ({ props }) => (
    <div
      style={{
        padding: "var(--openui-space-xl) var(--openui-space-l)",
        textAlign: "center",
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

export { MetricItem as Metric, PullQuote };
