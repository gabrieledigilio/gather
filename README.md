# Gather

Discover events nearby, picked for you. A minimal, premium event discovery app inspired by Luma — with a warm, editorial touch.

## Features

- **Guided onboarding** — mixed flow: welcome screens, location detection, interest swipes, schedule & budget picks, personality quiz, and notification opt-in (skippable anytime)
- **Personalized feed** — recommendation engine scores events by location, interests, budget, vibe, and social signals
- **Multiple views** — feed cards, compact list, and map
- **Save & share** — bookmark events, native share / copy link
- **Calendar sync** — Google Calendar link + `.ics` download
- **Social proof** — friends-going avatars on events
- **Create events** — publish community events (stored locally for now)
- **Notifications** — sample alerts UI (ready for push later)
- **Supabase Auth** — placeholder on profile (connect when ready)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on onboarding first.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- Local storage for preferences (Supabase-ready)

## Deploy

Deploy to [Vercel](https://vercel.com):

```bash
npx vercel
```
