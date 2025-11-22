"use client";

import { useMemo } from "react";
import { SectionCard } from "./section-card";
import type { WorkflowBlueprint } from "@/lib/workflow-types";

interface InsightTimelineProps {
  blueprint: WorkflowBlueprint;
}

export function InsightTimeline({ blueprint }: InsightTimelineProps) {
  const timeline = useMemo(() => buildTimeline(blueprint), [blueprint]);

  return (
    <SectionCard title="Activation Timeline" subtitle="Operator checkpoints across discovery, build, and launch">
      <ol className="space-y-4 text-sm text-white/70">
        {timeline.map((item) => (
          <li key={item.at} className="relative pl-6">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-accent-300" />
            <p className="text-xs uppercase tracking-wide text-white/40">{item.at}</p>
            <p className="font-medium text-white">{item.title}</p>
            <p className="text-xs text-white/60">{item.description}</p>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

function buildTimeline(blueprint: WorkflowBlueprint) {
  return [
    {
      at: "Session Kickoff",
      title: `Trigger command ${blueprint.trigger.commandSyntax ?? "/architect"}`,
      description: "Telegram bot verifies operator access and loads memory context."
    },
    {
      at: "Discovery",
      title: "AI gathers domain constraints",
      description:
        `Collect compliance signals and map knowledge base: ${blueprint.knowledgeBase
          .map((item) => item.title)
          .join(", ") || "add knowledge assets"}.`
    },
    {
      at: "Build",
      title: `${blueprint.actions.length} nodes orchestrated in n8n`,
      description: "Agent drafts workflow JSON and telemetry instrumentation with guardrails applied."
    },
    {
      at: "Review",
      title: blueprint.humanInLoop.enabled
        ? `Human review at ${blueprint.humanInLoop.reviewCheckpoints.join(" → ")}`
        : "Automated validation pipeline",
      description: blueprint.humanInLoop.enabled
        ? "Operators sign off before production import."
        : "Agent self-checks using unit tests before deployment."
    },
    {
      at: "Launch",
      title: "Deploy to production agents",
      description: blueprint.deploymentNotes
    }
  ];
}
