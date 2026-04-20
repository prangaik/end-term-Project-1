# ShowTime

ShowTime is a productivity suite for content creators to plan, write, edit, and track content performance in one place.

## Problem Statement

Content creators often use multiple disconnected tools for ideation, scripting, editing, scheduling, and analytics. This creates workflow fragmentation, context switching, and slower execution.

ShowTime solves this by providing an integrated dashboard where creators can:
- Capture and organize ideas
- Build scripts quickly
- Edit and export clips
- Plan and manage content pipelines
- Track growth and monetization data

## Features

- Dashboard overview for creator productivity and activity
- Idea Vault for capturing and organizing content ideas
- Script Builder for drafting and refining scripts
- Editing Hub with timeline-based clip actions (trim/cut/save/delete)
- Content Calendar for planning publishing schedules
- Content Manager for tracking content states and workflow
- Growth Lab and Analytics for performance insights
- Monetization, Community, and Learning Hub sections
- Theme support (light/dark) and authenticated app structure

## Tech Stack

- Frontend: React, Vite, React Router
- Styling/UI: Tailwind CSS, custom UI components, Lucide icons
- Charts/Data Visualization: Recharts
- Drag and Drop: `@hello-pangea/dnd`
- Video Editing (browser): `@ffmpeg/ffmpeg`, `@ffmpeg/core`, `@ffmpeg/util`
- Backend Services (integrated in project): Firebase

## Setup Instructions

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd FINAL
```

### 2) Install dependencies

```bash
npm install
```

### 3) Run in development

```bash
npm run dev
```

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Project Structure (High Level)

```text
src/
  components/
  context/
  pages/
  App.jsx
```

## Demo Video (Submission Requirement)

Record a 3-5 minute demo and cover:
- Problem: why ShowTime is needed
- Features: quick walkthrough of major modules
- Technical decisions: why React + Vite, FFmpeg for in-browser edits, and architecture choices

Suggested flow:
1. Intro + problem statement (30-45 sec)
2. Dashboard + idea/script workflow (60-90 sec)
3. Editing Hub trim/cut/save demo (60-90 sec)
4. Calendar/manager/analytics quick tour (45-60 sec)
5. Tech stack and key decisions (30-45 sec)

## Live Deployment (Recommended)

Deploy using Vercel or Netlify.

### Vercel
1. Import the GitHub repository in Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

### Netlify
1. Connect repository in Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy site

## Commit Message Guidelines

Use clear commit messages that describe intent and scope.

Good examples:
- `feat: add timeline trim and cut actions in Editing Hub`
- `fix: remove AI Coach route and reorder sidebar items`
- `docs: replace template readme with project documentation`

Avoid unclear messages like:
- `final final last v2`
- `changes`
- `update`
