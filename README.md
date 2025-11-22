# n8n AI Workflow Architect

Design Telegram-first n8n automations that ship with production-ready workflow JSON, technical documentation, and operator runbooks in a single interface.

## Features

- Guided blueprint editor for triggers, actions, knowledge bases, telemetry, and human review checkpoints
- Instant generation of three structured artefacts: n8n workflow JSON, Markdown technical spec, and operator runbook
- Prompt catalyst module that surfaces system/user prompt templates tailored to your blueprint
- Activation timeline summarising discovery → deployment checkpoints with guardrail highlights
- Local storage persistence so iterations survive refreshes

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to start shaping your workflow architect.

## Deployment

```bash
npm run build
npm start
```

When ready, deploy to Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-abfa5dea
```
