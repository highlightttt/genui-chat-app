"use client";
import "@openuidev/react-ui/components.css";
import "@openuidev/react-ui/styles/index.css";
import "./bebop-theme.css";

import {
  openAIMessageFormat,
  openAIReadableStreamAdapter,
} from "@openuidev/react-headless";
import { FullScreen } from "@openuidev/react-ui";
import { createLibrary } from "@openuidev/react-lang";

// Minimal set of OpenUI primitives needed for layout/text
import { openuiLibrary } from "@openuidev/react-ui/genui-lib";
const Stack = openuiLibrary.components["Stack"];
const TextContent = openuiLibrary.components["TextContent"];
const Card = openuiLibrary.components["Card"];
const CardHeader = openuiLibrary.components["CardHeader"];
const Separator = openuiLibrary.components["Separator"];
const MarkDownRenderer = openuiLibrary.components["MarkDownRenderer"];

// Custom Bebop components
import { PeopleBlock } from "@/components/PeopleBlock";
import { Metric, PullQuote } from "@/components/Highlights";
import { Timeline } from "@/components/Timeline";

const bebopLibrary = createLibrary({
  root: "Stack",
  componentGroups: [
    {
      name: "Layout",
      components: ["Stack", "Card", "CardHeader", "Separator"],
      notes: [
        'Stack is the root layout. Use direction "row" for horizontal, "column" (default) for vertical.',
        'Card wraps content in a styled container. variant: "card" | "sunk" | "clear".',
      ],
    },
    {
      name: "Content",
      components: ["TextContent", "MarkDownRenderer"],
    },
    {
      name: "People",
      components: ["PeopleBlock"],
      notes: [
        "Use PeopleBlock to surface team members, owners, or contacts inline.",
        "Each person has name, role, optional description and avatarUrl.",
        'groupLabel adds a section header like "Design Lead".',
      ],
    },
    {
      name: "Highlights",
      components: ["Metric", "PullQuote"],
      notes: [
        'Metric: big number + label + optional detail. value is the headline number (e.g. "50%", "3.2M").',
        "PullQuote: a short impactful quote visually separated with quotation marks.",
      ],
    },
    {
      name: "Timeline",
      components: ["Timeline"],
      notes: [
        "Timeline: chronological view with a vertical line and dots.",
        "Each event has marker (year/date), title, and optional description.",
      ],
    },
  ],
  components: [
    // Minimal OpenUI primitives
    Stack,
    TextContent,
    Card,
    CardHeader,
    Separator,
    MarkDownRenderer,
    // Custom Bebop components
    PeopleBlock,
    Metric,
    PullQuote,
    Timeline,
  ],
});

const bebopExamples = [
  `Example — People block:
root = Stack([heading, lead, designers])
heading = TextContent("Design Team", "large-heavy")
lead = PeopleBlock([Person("Jing Guan", "Principal Design Manager", "Leads the design direction")], "Design Lead")
designers = PeopleBlock([Person("Sylvia Kong", "Senior Designer", "Voice experience"), Person("Jane Liu", "Senior Designer", "Input experience")], "Core Designers")`,
  `Example — Highlights with metrics and pull quote:
root = Stack([title, quote, metrics])
title = TextContent("Key Findings", "large-heavy")
quote = PullQuote("AI enables faster development and richer personalization.")
metrics = Stack([m1, m2])
m1 = Metric("50%", "AI Adoption Growth", "One-third of teams launched AI features")
m2 = Metric("23%", "Annual UX Growth", "Driven by AI and generative design")`,
  `Example — Timeline:
root = Stack([title, tl])
title = TextContent("Cloud Market Evolution", "large-heavy")
tl = Timeline([TimelineEvent("2020", "Azure reaches ~20% share", "Doubling from mid-2010s"), TimelineEvent("2024", "Azure and Google grow 30%+", "AWS slows to ~19%"), TimelineEvent("2025", "Cloud spend hits $99B", "Azure solidifies #2 position")])`,
];

const systemPrompt = bebopLibrary.prompt({
  examples: bebopExamples,
  additionalRules: [
    'For grid-like layouts, use Stack with direction "row" and wrap=true.',
    "Use PeopleBlock when the response involves people, teams, or org structures.",
    "Use Metric for key statistics and PullQuote for impactful quotes.",
    "Use Timeline for chronological events, histories, or milestones.",
  ],
});

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <FullScreen
        processMessage={async ({ messages, abortController }) => {
          return fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemPrompt,
              messages: openAIMessageFormat.toApi(messages),
            }),
            signal: abortController.signal,
          });
        }}
        streamProtocol={openAIReadableStreamAdapter()}
        componentLibrary={bebopLibrary}
        agentName="Bebop Chat"
      />
    </div>
  );
}
