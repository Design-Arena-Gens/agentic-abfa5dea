"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SectionCard } from "./section-card";
import { buildStructuredOutputs } from "@/lib/workflow-generator";
import type { WorkflowBlueprint } from "@/lib/workflow-types";

const Markdown = dynamic(() => import("markdown-to-jsx"), { ssr: false });

interface OutputPanelProps {
  blueprint: WorkflowBlueprint;
}

const tabs = [
  { id: "workflow", label: "Workflow JSON" },
  { id: "doc", label: "Technical Doc" },
  { id: "runbook", label: "Operator Runbook" }
] as const;

export function OutputPanel({ blueprint }: OutputPanelProps) {
  const [selected, setSelected] = useState<"workflow" | "doc" | "runbook">("workflow");
  const outputs = useMemo(() => buildStructuredOutputs(blueprint), [blueprint]);

  return (
    <SectionCard
      title="Structured Outputs"
      subtitle="AI-ready artefacts generated from your blueprint"
      accent={<DownloadGroup outputs={outputs} />}
    >
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/5 bg-white/5 p-1 text-xs text-white/70">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelected(tab.id)}
            className={`rounded-xl px-3 py-2 transition ${
              selected === tab.id ? "bg-accent-500/30 text-white" : "hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="max-h-[520px] overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed">
        {selected === "workflow" ? (
          <pre className="text-xs text-accent-200">
            <code>{outputs.workflowJson}</code>
          </pre>
        ) : null}
        {selected === "doc" ? (
          <article className="prose prose-invert max-w-none">
            <Markdown>{outputs.technicalDoc.replace(/\\n/g, "\n\n")}</Markdown>
          </article>
        ) : null}
        {selected === "runbook" ? (
          <div className="space-y-3">
            {outputs.runbook.split("\n").map((line, index) => (
              <p key={index} className="text-sm text-white/80">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function DownloadGroup({ outputs }: { outputs: ReturnType<typeof buildStructuredOutputs> }) {
  const jsonBlob = useMemo(() => new Blob([outputs.workflowJson], { type: "application/json" }), [
    outputs.workflowJson
  ]);
  const docBlob = useMemo(() => new Blob([outputs.technicalDoc], { type: "text/markdown" }), [
    outputs.technicalDoc
  ]);
  const runbookBlob = useMemo(() => new Blob([outputs.runbook], { type: "text/plain" }), [
    outputs.runbook
  ]);

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => download(jsonBlob, "workflow.json")}
        className="rounded-full border border-accent-400/40 bg-accent-400/20 px-3 py-1 text-xs font-medium text-accent-200 transition hover:bg-accent-400/30"
      >
        Download JSON
      </button>
      <button
        type="button"
        onClick={() => download(docBlob, "technical-doc.md")}
        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/20"
      >
        Download Doc
      </button>
      <button
        type="button"
        onClick={() => download(runbookBlob, "operator-runbook.txt")}
        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/20"
      >
        Download Runbook
      </button>
    </div>
  );
}
