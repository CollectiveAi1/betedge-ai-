# BetEdge AI

**AI-Powered Sports Betting Research Assistant**

> Compare the market. Inspect the evidence. Find your edge.

BetEdge AI is a full-stack sports betting research platform covering NFL, NBA, MLB, NCAA Football, and NCAA Basketball.

## Project Structure

```
betedge-ai/
├── web/          # Next.js web application
├── mobile/       # React Native + Expo mobile app (iOS & Android)
├── BetEdge_AI_Design_Plan.md
└── propgpt_research.md
```

## Tech Stack

**Web:** Next.js, TypeScript, Tailwind CSS, NextAuth.js, PostgreSQL + Prisma, Stripe, Claude AI  
**Mobile:** React Native + Expo, Expo Router, Zustand, TanStack Query  
**Data:** The Odds API, ESPN API, BALLDONTLIE, College Football Data API

## Features

- AI-Graded Picks (A-F) with confidence percentages
- Cross-book odds comparison across multiple sportsbooks
- Player props analysis with historical trends
- Editable parlay builder with AI grading
- Personal pick tracker with ROI analytics
- Line movement & injury alerts (premium)
- Free / Pro ($9.99/mo) / Elite ($19.99/mo) tiers

## Getting Started

### Web App
```bash
cd web
yarn install
cp .env.example .env  # Add your API keys
yarn prisma generate
yarn dev
```

### Mobile App
```bash
cd mobile
yarn install
npx expo start
```
