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
- CodeRabbit — AI-assisted development tooling (optional).
- MongoDB — document-oriented database.
- Mongoose — ODM for MongoDB.
- Next.js — React framework (App Router, server components).
- PostHog — analytics (optional).
- Tailwind CSS — utility-first styling.
- TypeScript — static typing.
- Warp — modern terminal (optional developer tool).

🔋 Features

- Home Page: Displays a dynamic list of events (bundled + locally stored when DB absent).
- API Routes: Create, read, and fetch events with endpoints guarded to fall back to a local store when DB is unavailable.
- Cloudinary Integration: Optional — if configured, uploads will go to Cloudinary; otherwise images are saved to `public/uploads`.
- Event Details Page: Shows event information with registration and similar-event suggestions.
- Next.js 16 Caching: Uses server component patterns and cache-aware fetches for performance.
- PostHog Analytics: Optional integration for tracking user interactions.



