"use client";

import { useMemo } from "react";
import { WorkflowForm } from "@/components/workflow-form";
import { OutputPanel } from "@/components/output-panel";
import { ConversationSimulator } from "@/components/conversation-simulator";
import { InsightTimeline } from "@/components/insight-timeline";
import { usePersistentBlueprint } from "@/lib/use-persistent-blueprint";
import { defaultBlueprint } from "@/lib/default-blueprint";
import type { WorkflowBlueprint } from "@/lib/workflow-types";

export default function HomePage() {
  const { blueprint, setBlueprint, isHydrated } = usePersistentBlueprint();
  const heroStats = useMemo(() => buildHeroStats(blueprint), [blueprint]);

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent-300 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 pb-16">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16">
        <header className="mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/20 px-4 py-1 text-xs font-medium text-accent-200">
            <span className="h-2 w-2 rounded-full bg-accent-300" />
            Telegram-native AI workflow studio
          </div>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            n8n AI Workflow Architect
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            Design Telegram-first automation copilots that output production-ready n8n JSON, technical documentation, and operator runbooks in one flow.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.description}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <BadgeButton label="Reset to Canonical" onClick={() => setBlueprint(defaultBlueprint)} />
            <BadgeButton
              label="Duplicate blueprint"
              onClick={() => {
                const blob = new Blob([JSON.stringify(blueprint, null, 2)], {
                  type: "application/json"
                });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `${blueprint.projectName.replace(/\s+/g, "-").toLowerCase()}-blueprint.json`;
                anchor.click();
                URL.revokeObjectURL(url);
              }}
            />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <WorkflowForm blueprint={blueprint} onChange={setBlueprint} />
          </div>
          <div className="flex flex-col gap-8">
            <OutputPanel blueprint={blueprint} />
            <ConversationSimulator blueprint={blueprint} />
            <InsightTimeline blueprint={blueprint} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface HeroStat {
  label: string;
  value: string;
  description: string;
}

function buildHeroStats(blueprint: WorkflowBlueprint): HeroStat[] {
  return [
    {
      label: "Workflow nodes",
      value: `${blueprint.actions.length}`,
      description: "Nodes orchestrated from intake to launch"
    },
    {
      label: "Knowledge assets",
      value: `${blueprint.knowledgeBase.length}`,
      description: "Documents piped into retrieval layer"
    },
    {
      label: "Telemetry",
      value: `${blueprint.telemetry.length}`,
      description: "Events supporting ops visibility"
    }
  ];
}

function BadgeButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-medium text-white/70 transition hover:bg-white/20"
    >
      {label}
    </button>
  );
}
