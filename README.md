# Event Platform
A simple Next.js + TypeScript app for listing and creating developer events. 

📋 Table of Contents

    ✨ Introduction
    ⚙️ Tech Stack
    🔋 Features


✨ Introduction

Event Platform built to manage and showcase events seamlessly. It features a dynamic home page displaying upcoming events, robust API routes for CRUD operations, Cloudinary-powered image uploads, detailed event pages with registration and similar event suggestions, and integrated analytics to track user engagement and optimize performance.


⚙️ Tech Stack

- Cloudinary — cloud media management for image uploads and delivery.
- CodeRabbit — AI-assisted development tooling .
- MongoDB — document-oriented database.
- Mongoose — ODM for MongoDB.
- Next.js — React framework (App Router, server components).
- Tailwind CSS — utility-first styling.
- TypeScript — static typing.


🔋 Features

- Home Page: Displays a dynamic list of events (bundled + locally stored when DB absent).
- API Routes: Create, read, and fetch events with endpoints guarded to fall back to a local store when DB is unavailable.
- Cloudinary Integration: configured, uploads will go to Cloudinary; otherwise images are saved to `public/uploads`.
- Event Details Page: Shows event information with registration and similar-event suggestions.
- Next.js 16 Caching: Uses server component patterns and cache-aware fetches for performance.


- Without DB or Cloudinary, it falls back to `lib/constants.ts` (sample events) and `data/events.json` for created events; images go to `public/uploads/`.
- After creating an event, the client attempts to navigate to `/event/<slug>` and refresh server components so the homepage and event pages show the new item immediately.




