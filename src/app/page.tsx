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
import { FilesBlock } from "@/components/FilesBlock";
import { EmailsBlock } from "@/components/EmailsBlock";
import { MeetingsBlock } from "@/components/MeetingsBlock";

// Extend OpenUI with custom Bebop components
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
    {
      name: "Files",
      components: ["FilesBlock"],
      notes: [
        "FilesBlock: surfaces key files inline with icon, title, author, time, description.",
        "fileType controls icon: word (blue W), excel (green X), powerpoint (orange P), pdf (red), generic (purple).",
        "Click a file to see preview and actions.",
        'sectionLabel adds header like "📁 Files".',
      ],
    },
    {
      name: "Emails",
      components: ["EmailsBlock"],
      notes: [
        "EmailsBlock: surfaces key emails with sender avatar, subject, time, summary.",
        "Intended for awareness and triage, not full email reading.",
        "Set isRead=false for bold unread styling.",
        'sectionLabel adds header like "📬 Top Emails".',
      ],
    },
    {
      name: "Meetings",
      components: ["MeetingsBlock"],
      notes: [
        "MeetingsBlock: surfaces calendar meetings with blue bar, time, duration, title.",
        "Set needsAction=true for Accept/Decline buttons.",
        "prepNotes array adds preparation items shown in detail panel.",
        'dateLabel adds header like "Tuesday, January 6".',
      ],
    },
  ],
  components: [
    ...Object.values(openuiLibrary.components),
    PeopleBlock,
    Metric,
    PullQuote,
    Timeline,
    FilesBlock,
    EmailsBlock,
    MeetingsBlock,
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
    `Example — Files block:
root = Stack([label, files])
label = TextContent("📁 Files", "large-heavy")
files = FilesBlock([File("Generative UX Terminology", "Elisa Nasen", "updated 2d ago", "A structured breakdown of GenUX concepts: Elevation levels (apps → fragments → components → design elements).", "word"), File("Reasoning Change Checklist", "Elisa Nasen", "updated 2d ago", "How reasoning outputs affect GenUX.", "word")], "📁 Files")`,
    `Example — Emails block:
root = Stack([label, emails])
label = TextContent("📬 Top Emails", "large-heavy")
emails = EmailsBlock([Email("If you can imagine it, just Vibe Code it!", "Zidong Chen", "Studio DC", "11:00 AM", "Studio DC announcement around vibe coding learnings, relevant to innovation threads.", false), Email("Re: Unified CoT | Week 11/17 update", "Hao Zhang (MSAI)", "", "11:00 AM", "Covers new feature releases, rollout tables, input & response UX.", true)], "📬 Top Emails")`,
    `Example — Meetings block:
root = Stack([date, meetings, prep])
date = TextContent("Tuesday, January 6", "large-heavy")
meetings = MeetingsBlock([Meeting("Weekly Spec Alignment", "10:00 AM", "30min", "Teams Meeting · PiPaJi Room", "Teams Meeting", true, []), Meeting("Orion Bug Bash", "11:15 AM", "45min", "Teams Meeting", "Teams Meeting", false, []), Meeting("Nebula UX Review", "2:05 PM", "55min", "Teams Meeting", "Teams Meeting", false, [])], "Tuesday, January 6")
prep = TextContent("**Weekly Spec Alignment**\\n• Walk through user flow, component interactions\\n• Clarify rationale (discoverability vs. cognitive load)", "default")`,
  ],
  additionalRules: [
    ...openuiAdditionalRules,
    "Use PeopleBlock when showing people, teams, or org structures.",
    "Use Metric for key statistics and PullQuote for impactful quotes.",
    "Use Timeline for chronological events, histories, or milestones.",
  ],
});

// M365-style welcome component
function M365Welcome() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "0 24px",
      }}
    >
      <h1
        style={{
          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          fontWeight: 300,
          fontSize: 32,
          color: "#242424",
          margin: 0,
          textAlign: "center",
        }}
      >
        Hi, how can I help you?
      </h1>
    </div>
  );
}

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
        agentName="Baby M365"
        logoUrl="/copilot-logo.svg"
        welcomeMessage={{
          title: "Hi, how can I help you?",
        }}
        conversationStarters={{
          variant: "short",
          options: [
            {
              displayText: "Recap Monthly Studio 8 UX Friday & All Hands",
              prompt: "Recap Monthly Studio 8 UX Friday & All Hands from recent meetings",
              icon: <span style={{ fontSize: 20 }}>📋</span>,
            },
            {
              displayText: "Emails from Candice Li (Shanghai Wicresoft Co Ltd)...",
              prompt: "Show me recent emails from Candice Li at Shanghai Wicresoft Co Ltd",
              icon: <span style={{ fontSize: 20 }}>🐸</span>,
            },
            {
              displayText: "Rewrite this content to make it more professional and concise: Text",
              prompt: "Rewrite this content to make it more professional and concise",
              icon: <span style={{ fontSize: 20 }}>✏️</span>,
            },
          ],
        }}
      />
    </div>
  );
}
