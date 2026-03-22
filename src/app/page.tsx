"use client";
import "@openuidev/react-ui/components.css";
import "@openuidev/react-ui/styles/index.css";
import "./bebop-theme.css";

import {
  openAIMessageFormat,
  openAIReadableStreamAdapter,
} from "@openuidev/react-headless";
import { FullScreen } from "@openuidev/react-ui";
import {
  openuiLibrary,
  openuiExamples,
  openuiAdditionalRules,
} from "@openuidev/react-ui/genui-lib";
import { createLibrary } from "@openuidev/react-lang";

// Custom Bebop components
import { PeopleBlock } from "@/components/PeopleBlock";
import { Metric, PullQuote } from "@/components/Highlights";
import { Timeline } from "@/components/Timeline";

// Extend OpenUI with custom Bebop components (keep ALL built-in components intact)
const bebopLibrary = createLibrary({
  root: "Stack",
  componentGroups: [
    ...(openuiLibrary.componentGroups ?? []),
    {
      name: "People",
      components: ["PeopleBlock"],
      notes: [
        "Use PeopleBlock to surface team members, owners, or contacts.",
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
        "Timeline: chronological view with vertical line and dots.",
        "Each event has marker (year/date), title, and optional description.",
      ],
    },
  ],
  components: [
    // ALL original OpenUI components
    ...Object.values(openuiLibrary.components),
    // Custom Bebop components
    PeopleBlock,
    Metric,
    PullQuote,
    Timeline,
  ],
});

const systemPrompt = bebopLibrary.prompt({
  examples: [
    ...openuiExamples,
    `Example — People block:
root = Stack([heading, lead, designers])
heading = TextContent("Design Team", "large-heavy")
lead = PeopleBlock([Person("Jing Guan", "Principal Design Manager", "Leads the design direction")], "Design Lead")
designers = PeopleBlock([Person("Sylvia Kong", "Senior Designer"), Person("Jane Liu", "Senior Designer")], "Core Designers")`,
    `Example — Highlights:
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
  ],
  additionalRules: [
    ...openuiAdditionalRules,
    "Use PeopleBlock when showing people, teams, or org structures.",
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
