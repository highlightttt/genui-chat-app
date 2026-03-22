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
  openuiAdditionalRules,
} from "@openuidev/react-ui/genui-lib";
import { createLibrary } from "@openuidev/react-lang";

// Cherry-pick only the components we want to keep
const keep = [
  // Layout essentials
  "Stack",
  "Separator",
  // Content essentials
  "Card",
  "CardHeader",
  "TextContent",
  "MarkDownRenderer",
  // Interaction essentials
  "Button",
  "Buttons",
];

const keptComponents = keep.map((name) => openuiLibrary.components[name]);

const bebopLibrary = createLibrary({
  root: "Stack",
  componentGroups: [
    {
      name: "Layout",
      components: ["Stack", "Separator"],
      notes: [
        'Stack is the root layout. direction "row" for horizontal, "column" (default) for vertical.',
        'Use wrap=true for grid-like layouts.',
      ],
    },
    {
      name: "Content",
      components: ["Card", "CardHeader", "TextContent", "MarkDownRenderer"],
    },
    {
      name: "Buttons",
      components: ["Button", "Buttons"],
    },
  ],
  components: keptComponents,
});

const systemPrompt = bebopLibrary.prompt({
  examples: [
    `Example — Simple card layout:
root = Stack([title, card])
title = TextContent("Overview", "large-heavy")
card = Card([desc, actions])
desc = TextContent("A concise summary of the topic.")
actions = Buttons([Button("Learn More", { type: "continue_conversation" }, "primary")])`,
  ],
  additionalRules: [
    ...openuiAdditionalRules,
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
