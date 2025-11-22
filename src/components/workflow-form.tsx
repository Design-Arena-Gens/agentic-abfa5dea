"use client";

import { useMemo } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { SectionCard } from "./section-card";
import type { WorkflowBlueprint } from "@/lib/workflow-types";

const triggerOptions = [
  { value: "telegram_command", label: "Telegram Command" },
  { value: "webhook", label: "Webhook" },
  { value: "schedule", label: "Scheduled" },
  { value: "http_polling", label: "HTTP Polling" },
  { value: "manual", label: "Manual" }
] as const;

const memoryOptions = [
  { value: "vector_db", label: "Vector DB" },
  { value: "postgres", label: "Postgres" },
  { value: "json_file", label: "JSON File" },
  { value: "redis", label: "Redis Cache" }
] as const;

interface WorkflowFormProps {
  blueprint: WorkflowBlueprint;
  onChange: (blueprint: WorkflowBlueprint) => void;
}

export function WorkflowForm({ blueprint, onChange }: WorkflowFormProps) {
  const actionCriticalCount = useMemo(
    () => blueprint.actions.filter((action) => action.critical).length,
    [blueprint.actions]
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Workspace Intelligence"
        subtitle="High-level signals that shape the assistant's behaviour trail."
        accent={<Badge text={`${actionCriticalCount} critical path`} />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Project Name"
            value={blueprint.projectName}
            onChange={(value) =>
              onChange({ ...blueprint, projectName: value })
            }
            placeholder="Growth Ops Copilot"
          />
          <Field
            label="Success Criteria"
            value={blueprint.successCriteria}
            onChange={(value) =>
              onChange({ ...blueprint, successCriteria: value })
            }
            placeholder="Launch workflows in under 5 minutes"
          />
        </div>
        <Field
          label="Executive Summary"
          value={blueprint.executiveSummary}
          onChange={(value) =>
            onChange({ ...blueprint, executiveSummary: value })
          }
          multiline
          placeholder="Describe what the assistant should automate..."
        />
        <Field
          label="User Persona"
          value={blueprint.userPersona}
          onChange={(value) => onChange({ ...blueprint, userPersona: value })}
          multiline
          placeholder="Who will be talking to the Telegram bot?"
        />
      </SectionCard>

      <SectionCard title="Trigger Layer" subtitle="Define how the Telegram bot wakes up and listens.">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Trigger Type"
            value={blueprint.trigger.type}
            options={triggerOptions.map((option) => ({
              value: option.value,
              label: option.label
            }))}
            onChange={(value) =>
              onChange({
                ...blueprint,
                trigger: { ...blueprint.trigger, type: value as typeof blueprint.trigger.type }
              })
            }
          />
          <Field
            label="Entry Point"
            value={blueprint.trigger.entryPoint}
            onChange={(value) =>
              onChange({
                ...blueprint,
                trigger: { ...blueprint.trigger, entryPoint: value }
              })
            }
            placeholder="Telegram Bot API"
          />
        </div>
        <Field
          label="Command Syntax"
          value={blueprint.trigger.commandSyntax ?? ""}
          onChange={(value) =>
            onChange({
              ...blueprint,
              trigger: {
                ...blueprint.trigger,
                commandSyntax: value || undefined
              }
            })
          }
          placeholder="/architect"
        />
      </SectionCard>

      <SectionCard
        title="Automation Path"
        subtitle="Capture each action the AI agent should orchestrate inside n8n."
        accent={
          <button
            onClick={() =>
              onChange({
                ...blueprint,
                actions: [
                  ...blueprint.actions,
                  {
                    id: createId(),
                    title: "Untitled Node",
                    service: "n8n Function",
                    description: "Describe what this node should accomplish",
                    critical: false
                  }
                ]
              })
            }
            className="flex items-center gap-2 rounded-full border border-accent-400/60 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-300 transition hover:bg-accent-500/20"
            type="button"
          >
            <PlusIcon className="h-4 w-4" />
            Add Action
          </button>
        }
      >
        <div className="space-y-4">
          {blueprint.actions.map((action, index) => (
            <div
              key={action.id}
              className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <Field
                label={`Step ${index + 1} Title`}
                value={action.title}
                onChange={(value) => {
                  const next = [...blueprint.actions];
                  next[index] = { ...action, title: value };
                  onChange({ ...blueprint, actions: next });
                }}
                placeholder="Human QA Review"
              />
              <Field
                label="Service"
                value={action.service}
                onChange={(value) => {
                  const next = [...blueprint.actions];
                  next[index] = { ...action, service: value };
                  onChange({ ...blueprint, actions: next });
                }}
                placeholder="n8n HTTP Request"
              />
              <div className="flex items-start justify-end gap-3">
                <label className="mt-1 flex items-center gap-2 text-xs text-white/60">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-accent-400"
                    checked={action.critical ?? false}
                    onChange={(event) => {
                      const next = [...blueprint.actions];
                      next[index] = { ...action, critical: event.target.checked };
                      onChange({ ...blueprint, actions: next });
                    }}
                  />
                  Critical path
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = blueprint.actions.filter((_, idx) => idx !== index);
                    onChange({ ...blueprint, actions: next });
                  }}
                  className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-red-400/60 hover:text-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <Field
                label="Description"
                value={action.description}
                onChange={(value) => {
                  const next = [...blueprint.actions];
                  next[index] = { ...action, description: value };
                  onChange({ ...blueprint, actions: next });
                }}
                placeholder="Detail the business logic and data hand-offs"
                multiline
                className="md:col-span-3"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Knowledge + Memory" subtitle="Define persistent knowledge and memory strategy for the AI.">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Memory Backend"
            value={blueprint.memory.strategy}
            options={memoryOptions.map((option) => ({
              value: option.value,
              label: option.label
            }))}
            onChange={(value) =>
              onChange({
                ...blueprint,
                memory: {
                  ...blueprint.memory,
                  strategy: value as typeof blueprint.memory.strategy
                }
              })
            }
          />
          <Field
            label="Retention Horizon"
            value={blueprint.memory.retention}
            onChange={(value) =>
              onChange({
                ...blueprint,
                memory: { ...blueprint.memory, retention: value }
              })
            }
            placeholder="Rolling 30 days"
          />
        </div>
        <Field
          label="Embedding Model"
          value={blueprint.memory.embeddingModel}
          onChange={(value) =>
            onChange({
              ...blueprint,
              memory: { ...blueprint.memory, embeddingModel: value }
            })
          }
          placeholder="text-embedding-3-large"
        />
        <KnowledgeEditor
          items={blueprint.knowledgeBase}
          title="Knowledge Sources"
          emptyCopy="Map documents, tables, or APIs that inform AI responses"
          onChange={(knowledgeBase) => onChange({ ...blueprint, knowledgeBase })}
        />
      </SectionCard>

      <SectionCard title="Safeguards" subtitle="Telemetry instrumentation and human review gates.">
        <TelemetryEditor
          items={blueprint.telemetry}
          title="Telemetry Events"
          emptyCopy="Log events to keep leadership dashboards trustworthy"
          onChange={(telemetry) => onChange({ ...blueprint, telemetry })}
        />
        <label className="flex items-center gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-transparent text-accent-400"
            checked={blueprint.humanInLoop.enabled}
            onChange={(event) =>
              onChange({
                ...blueprint,
                humanInLoop: {
                  ...blueprint.humanInLoop,
                  enabled: event.target.checked
                }
              })
            }
          />
          Human needs to approve critical steps
        </label>
        <Field
          label="Review Checkpoints"
          value={blueprint.humanInLoop.reviewCheckpoints.join(" | ")}
          onChange={(value) =>
            onChange({
              ...blueprint,
              humanInLoop: {
                ...blueprint.humanInLoop,
                reviewCheckpoints: value
                  .split("|")
                  .map((item) => item.trim())
                  .filter(Boolean)
              }
            })
          }
          placeholder="Finance review | Compliance QA"
        />
      </SectionCard>

      <SectionCard title="Deployment Notes" subtitle="Runbook highlights for operators preparing go-live.">
        <Field
          label="Operational Notes"
          multiline
          value={blueprint.deploymentNotes}
          onChange={(value) => onChange({ ...blueprint, deploymentNotes: value })}
          placeholder="Credential strategy, token rotations, rollout cadence..."
        />
      </SectionCard>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

function Field({ label, value, onChange, multiline, className, placeholder }: FieldProps) {
  if (multiline) {
    return (
      <label className={`flex flex-col gap-2 ${className ?? ""}`}>
        <span className="text-xs font-medium uppercase tracking-wide text-white/50">
          {label}
        </span>
        <textarea
          className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 outline-none transition focus:border-accent-300 focus:shadow-focus"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </label>
    );
  }

  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </span>
      <input
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 outline-none transition focus:border-accent-300 focus:shadow-focus"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </span>
      <select
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 outline-none transition focus:border-accent-300 focus:shadow-focus"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-midnight-900">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-accent-400/40 bg-accent-500/10 px-4 py-1 text-xs font-medium text-accent-200">
      {text}
    </span>
  );
}

type KnowledgeCollection = WorkflowBlueprint["knowledgeBase"];
type TelemetryCollection = WorkflowBlueprint["telemetry"];

interface KnowledgeEditorProps {
  items: KnowledgeCollection;
  title: string;
  emptyCopy: string;
  onChange: (items: KnowledgeCollection) => void;
}

function KnowledgeEditor({ items, title, emptyCopy, onChange }: KnowledgeEditorProps) {
  return (
    <div className="space-y-4">
      <CollectionHeader title={title} emptyCopy={emptyCopy} onAdd={() => onChange([...items, createKnowledgeItem()])} />
      {items.length === 0 ? (
        <CollectionEmptyState />
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <Field
                label="Title"
                value={item.title}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, title: value };
                  onChange(next);
                }}
                placeholder="Compliance Checklist"
              />
              <SelectField
                label="Type"
                value={item.sourceType}
                options={[
                  { value: "notion", label: "Notion" },
                  { value: "gdoc", label: "Google Doc" },
                  { value: "airtable", label: "Airtable" },
                  { value: "custom", label: "Custom" }
                ]}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, sourceType: value as KnowledgeCollection[number]["sourceType"] };
                  onChange(next);
                }}
              />
              <Field
                label="Access"
                value={item.accessDetails}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, accessDetails: value };
                  onChange(next);
                }}
                placeholder="Share link or API token"
                className="md:col-span-3"
              />
              <RemoveRowButton onRemove={() => onChange(items.filter((_, idx) => idx !== index))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface TelemetryEditorProps {
  items: TelemetryCollection;
  title: string;
  emptyCopy: string;
  onChange: (items: TelemetryCollection) => void;
}

function TelemetryEditor({ items, title, emptyCopy, onChange }: TelemetryEditorProps) {
  return (
    <div className="space-y-4">
      <CollectionHeader
        title={title}
        emptyCopy={emptyCopy}
        onAdd={() =>
          onChange([
            ...items,
            {
              capture: "workflow.event",
              destination: "Data Warehouse"
            }
          ])
        }
      />
      {items.length === 0 ? (
        <CollectionEmptyState />
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.capture}-${index}`}
              className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <Field
                label="Capture"
                value={item.capture}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, capture: value };
                  onChange(next);
                }}
                placeholder="workflow.step_completed"
              />
              <Field
                label="Destination"
                value={item.destination}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...item, destination: value };
                  onChange(next);
                }}
                placeholder="BigQuery"
              />
              <RemoveRowButton onRemove={() => onChange(items.filter((_, idx) => idx !== index))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionHeader({ title, emptyCopy, onAdd }: { title: string; emptyCopy: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-white/50">{emptyCopy}</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-medium text-white/70 transition hover:bg-white/20"
      >
        <PlusIcon className="h-4 w-4" />
        Add
      </button>
    </div>
  );
}

function CollectionEmptyState() {
  return (
    <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-xs text-white/40">
      No entries yet.
    </p>
  );
}

function RemoveRowButton({ onRemove }: { onRemove: () => void }) {
  return (
    <div className="flex items-start justify-end">
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full border border-white/10 p-2 text-white/50 transition hover:border-red-400/60 hover:text-red-400"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function createKnowledgeItem(): KnowledgeCollection[number] {
  return {
    id: createId(),
    title: "Untitled Source",
    sourceType: "custom",
    accessDetails: "Describe how to fetch this data"
  };
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
