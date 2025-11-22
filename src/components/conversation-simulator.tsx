"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { SectionCard } from "./section-card";
import type { WorkflowBlueprint } from "@/lib/workflow-types";

const promptTemplates = [
  {
    id: "discovery",
    label: "Discovery",
    system:
      "You are the n8n AI Workflow Architect. Extract triggers, actions, and guardrails from the user with short probing questions.",
    user:
      "We need an onboarding automation for new partner creators. Trigger when they submit the airtable form."
  },
  {
    id: "refine",
    label: "Refinement",
    system:
      "Use existing blueprint memory to fill gaps. Ask follow-ups for missing telemetry destinations.",
    user: "Make sure compliance approves any copy before shipping."
  },
  {
    id: "handoff",
    label: "Handoff",
    system:
      "Summarize the orchestrated automation, highlight human checkpoints, and attach exportable assets.",
    user: "Generate the full package for import."
  }
];

interface ConversationSimulatorProps {
  blueprint: WorkflowBlueprint;
}

export function ConversationSimulator({ blueprint }: ConversationSimulatorProps) {
  const [activePrompt, setActivePrompt] = useState(promptTemplates[0]);

  return (
    <SectionCard
      title="Prompt Catalyst"
      subtitle="Inject these prompts into your Telegram agent to guide build-out conversations"
      accent={<TemplateSwitcher activeId={activePrompt.id} onSelect={(id) => setActivePrompt(promptTemplates.find((item) => item.id === id) ?? promptTemplates[0])} />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/80">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-200">System Prime</p>
          <p>{activePrompt.system}</p>
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/80">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-200">User Kickoff</p>
          <p>{activePrompt.user}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
        <p className="mb-2 flex items-center gap-2 text-accent-200">
          <SparklesIcon className="h-4 w-4" />
          Tailored Hooks
        </p>
        <ul className="space-y-2 text-white/70">
          <li>
            • Mention <span className="text-accent-200">{blueprint.trigger.entryPoint}</span> as the primary entry point.
          </li>
          <li>
            • Ask for confirmation before executing <span className="text-accent-200">{blueprint.actions.filter((action) => action.critical).map((action) => action.title).join(", ") || "critical steps"}</span>.
          </li>
          <li>
            • Store contextual insights in <span className="text-accent-200">{blueprint.memory.strategy}</span> memory tier.
          </li>
        </ul>
      </div>
    </SectionCard>
  );
}

interface TemplateSwitcherProps {
  activeId: string;
  onSelect: (id: string) => void;
}

function TemplateSwitcher({ activeId, onSelect }: TemplateSwitcherProps) {
  return (
    <nav className="flex gap-2">
      {promptTemplates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            template.id === activeId
              ? "border-accent-400/60 bg-accent-500/20 text-accent-100"
              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          {template.label}
        </button>
      ))}
    </nav>
  );
}
