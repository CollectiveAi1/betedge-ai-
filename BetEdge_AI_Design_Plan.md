# BetEdge AI — Complete Design & Architecture Plan
### AI-Powered Sports Betting Research Assistant
*Web + Mobile | NFL · NBA · MLB · NCAA*

---

## 1. Product Vision & Positioning

**What it is:** An evidence-first sports betting research assistant that gives bettors transparent, AI-generated analysis across all major bet types — player props, spreads, moneylines, totals, and parlays — for NFL, NBA, MLB, and NCAA.

**Core Promise:**
> Compare the market, inspect the evidence, understand the edge, and make smarter decisions.

**Key Differentiators over PropGPT:**
- Cross-book odds comparison (best available line, consensus line)
- Editable parlays with removable/replaceable individual legs
- NCAA Football + Basketball first-class coverage (PropGPT gaps here)
- Evidence-linked AI explanations (source, timestamp, line, uncertainty shown)
- Transparent confidence scoring tied to documented edge bands
- Web and mobile feature parity
- Responsible gambling framing (educational/research tool)

---

## 2. Feature Map — Full Product

### 2.1 Core Features (Free Tier)
| Feature | Description |
|---|---|
| Daily AI Picks Feed | Curated top picks for the day across all sports, with grades (A–F) |
| Game Picks | Moneyline, spread, total analysis for every game |
| Player Props (limited) | Up to 5 prop views per day on free tier |
| Sport/League Filter | NFL, NBA, MLB, NCAA (football + basketball) |
| Bet Grades | A–F grading system with confidence percentage |
| Basic Odds Display | Single-book odds (default best available) |
| Injury Feed | Latest injury reports pulled from ESPN/API |
| Schedule & Matchups | Today/tomorrow game schedule with key matchup data |
| Account & Saved Picks | Save up to 10 picks per day |

### 2.2 Premium Features (Subscription)
| Feature | Description |
|---|---|
| Unlimited Props | Full player prop access for all games |
| Cross-Book Odds Comparison | Best line across 10+ sportsbooks side-by-side |
| Parlay Builder | Build/edit parlays, remove/replace legs, AI grades each combo |
| AI Deep Analysis | Full AI-generated research packet per pick (matchups, trends, injuries, line movement) |
| Direct Matchup Data | Player vs. opponent defender/team stats in specific roles |
| Line Movement Tracker | Opening vs. current line, sharp money indicators |
| Historical Trends | Last 10, 20, season performance in specific contexts |
| Alerts & Notifications | Line movement alerts, pick updates, injury alerts |
| Backtesting Dashboard | Track your own picks, ROI, grade accuracy |
| Export Picks | Share/export research packets |
| Early Access Picks | Premium picks released earlier in the day |

### 2.3 Future Features (Post-MVP)
- Live betting analysis
- Fantasy lineup optimizer
- Bet tracking integration with sportsbooks
- Advanced probability model (proprietary)
- Discord/Telegram alerts bot

---

## 3. Tech Stack

### 3.1 Web App (Next.js)
```
Frontend:  Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI
State:     Zustand + React Query (TanStack Query)
Charts:    Recharts / Chart.js
Auth:      NextAuth.js (email/password + Google OAuth)
Payments:  Stripe (subscription billing)
Database:  PostgreSQL (Prisma ORM)
Hosting:   Abacus.AI platform
```

### 3.2 Mobile App (React Native + Expo)
```
Framework: React Native + Expo (shared backend with web)
State:     Zustand + TanStack Query
Auth:      Same JWT tokens from shared backend
Payments:  Stripe (web redirect for subscriptions)
Push:      Expo Notifications
```

### 3.3 Backend API (built into Next.js)
```
API Routes: Next.js API routes (RESTful)
AI Layer:   Anthropic Claude API (analysis generation)
Cron Jobs:  Vercel Cron / custom scheduler for data refresh
Cache:      Redis / in-memory caching for odds data
```

---

## 4. Data Pipeline & API Strategy

### 4.1 Free/Low-Cost APIs (Phase 1)

| API | Coverage | Cost | Use Case |
|---|---|---|---|
| **The Odds API** | NFL, NBA, MLB, NCAA — odds across 40+ books | Free: 500 credits/mo; $10/mo for 10k credits | Core odds data, spreads, moneylines, totals, player props |
| **ESPN Unofficial API** | All 4 sports — scores, schedules, injuries, rosters, stats | Free (unofficial) | Scores, injury reports, schedules, team/player data |
| **BALLDONTLIE API** | NBA stats, player data, game logs | Free (rate limited) | NBA player stats, game-by-game data |
| **College Football Data API (CFBD)** | NCAA football & basketball | Free dev key; paid for high-volume | NCAA schedules, stats, rankings, odds |
| **SportsDataIO** | All sports | Free dev tier | Backup/supplementary stats |
| **Tank01 (RapidAPI)** | NFL, NBA, MLB player props | ~$10-50/mo on RapidAPI | Player prop lines from multiple books |

### 4.2 Data Refresh Strategy
```
Odds data:        Refresh every 5 minutes during game windows
Injury reports:   Refresh every 30 minutes
Schedules:        Refresh once daily (midnight)
Player stats:     Refresh every hour during season
AI analysis:      Generated on-demand + cached per pick per day
Line movement:    Refresh every 2 minutes for premium users
```

### 4.3 AI Analysis Pipeline
```
1. Fetch structured data for the market (odds, stats, injuries, trends)
2. Build a structured context packet (JSON)
3. Send to Claude API with specialized sports analysis prompt
4. Parse response → extract grade, confidence %, key factors, risks
5. Cache result for 4 hours (regenerate if line moves >0.5 points)
6. Display as human-readable "research packet" in UI
```

### 4.4 AI Prompt Strategy
```
System Prompt: "You are an expert sports analyst and betting researcher. 
Your role is educational — helping users understand market value and 
evidence. Never promise wins. Always show uncertainty. Cite the data 
you were given. Grade from A (strong edge) to F (avoid)."

User Prompt: Inject structured JSON with:
- Market: [player, stat, line, over/under]
- Current odds: [best_available, consensus, book_breakdown]
- Player stats: [last_10, season, vs_opponent, role_specific]
- Opponent: [rank vs. stat, recent form, injuries]
- Injuries: [player status, team injuries, lineup impact]
- Line movement: [open, current, sharp_action]
- Historical: [hit_rate_context, trends]

Output Format: JSON with fields:
- grade: "A" | "B" | "C" | "D" | "F"
- confidence: 0-100
- recommendation: "OVER" | "UNDER" | "AVOID" | "LEAN OVER" | "LEAN UNDER"
- edge_summary: string (1 sentence)
- key_factors: string[] (3-5 bullet points)
- risks: string[] (2-3 bullet points)
- disclaimer: string
```

---

## 5. Database Schema

### 5.1 Core Tables
```sql
-- Users
users (id, email, name, avatar, created_at, subscription_tier)

-- Subscriptions
subscriptions (id, user_id, stripe_customer_id, stripe_subscription_id, 
               tier, status, current_period_end)

-- Games
games (id, sport, league, home_team, away_team, game_time, status, 
       home_score, away_score, season, week)

-- Odds (refreshed continuously)
odds (id, game_id, market_type, sportsbook, line, over_odds, under_odds, 
      home_odds, away_odds, last_updated)

-- Player Props
player_props (id, game_id, player_id, stat_type, line, over_odds, 
              under_odds, sportsbook, last_updated)

-- Players
players (id, name, team, sport, position, status, injury_report, 
         jersey_number)

-- AI Picks (cached analysis)
ai_picks (id, market_type, market_ref_id, grade, confidence, 
          recommendation, analysis_json, generated_at, expires_at)

-- User Saved Picks
user_picks (id, user_id, pick_ref_id, market_type, selection, 
            stake, result, created_at)

-- Parlays
parlays (id, user_id, name, legs_json, combined_odds, grade, 
         confidence, status, created_at)

-- Alerts
alerts (id, user_id, alert_type, market_ref_id, threshold, 
        is_triggered, created_at)
```

---

## 6. UI/UX Blueprint

### 6.1 Navigation Structure
```
App Shell
├── / (Landing Page — marketing, CTA, sample picks)
├── /dashboard (Today's Top Picks Feed)
│   ├── Sport filter tabs: NFL | NBA | MLB | NCAAF | NCAAB
│   └── Pick cards: grade badge, recommendation, key factor, odds
├── /games (All Games Today/Tomorrow)
│   └── /games/[gameId] (Game Detail — all markets for one game)
├── /props (Player Props Browser)
│   └── /props/[propId] (Prop Detail — full AI research packet)
├── /parlay-builder (Build & grade custom parlays)
├── /trends (Historical trends & stats explorer)
├── /tracker (Personal pick tracker & ROI dashboard)
├── /alerts (Set up line movement & injury alerts)
├── /account (Profile, subscription, settings)
└── /upgrade (Paywall & pricing page)
```

### 6.2 Key Screen Designs

#### Dashboard / Today's Feed
```
┌─────────────────────────────────────────────────────┐
│  BetEdge AI        [NFL] [NBA] [MLB] [NCAAF] [NCAAB] │
│─────────────────────────────────────────────────────│
│  Today's Top Picks · Wednesday, Sep 9               │
│─────────────────────────────────────────────────────│
│  ┌──────────────────────────────────────────────┐  │
│  │ 🏈 NFL  Chiefs @ Ravens  · 8:20 PM ET        │  │
│  │ Patrick Mahomes — Passing Yards              │  │
│  │ OVER 285.5  [-115]   Grade: A  92% conf      │  │
│  │ "Strong historical edge vs. zone coverage.." │  │
│  │ [View Analysis]  [Save Pick]  [Add to Parlay] │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🏀 NBA  Lakers @ Celtics  · 7:30 PM ET       │  │
│  │ LeBron James — Points                        │  │
│  │ OVER 24.5  [-110]   Grade: B  76% conf       │  │
│  │ "Favorable matchup vs. a weak paint defense" │  │
│  │ [View Analysis]  [Save Pick]  [Add to Parlay] │  │
│  └──────────────────────────────────────────────┘  │
│                          [🔒 Upgrade for 47 more]  │
└─────────────────────────────────────────────────────┘
```

#### Prop Detail (Full Research Packet)
```
┌─────────────────────────────────────────────────────┐
│  ← Back      Patrick Mahomes — Passing Yards        │
│─────────────────────────────────────────────────────│
│  Grade: A   Confidence: 92%   Rec: OVER 285.5       │
│─────────────────────────────────────────────────────│
│  Odds Comparison (Best Available)                   │
│  FanDuel: -115  DraftKings: -112 ✓  BetMGM: -118    │
│─────────────────────────────────────────────────────│
│  Key Factors                                        │
│  ✅ 8/10 last games OVER this line                   │
│  ✅ Ravens rank 28th vs. pass (338 avg allowed)      │
│  ✅ Chiefs projected high game total (49.5)          │
│  ⚠️  Slight wind factor at M&T Bank                 │
│─────────────────────────────────────────────────────│
│  Risks                                              │
│  ❌ Ravens may go zone to limit big plays            │
│  ❌ Line has moved from 280.5 (sharp money on over)  │
│─────────────────────────────────────────────────────│
│  AI Analysis  (Updated 12 min ago)                  │
│  "Mahomes has cleared this line in 8 of his last..." │
│─────────────────────────────────────────────────────│
│  Historical Trend (Last 10 games)                   │
│  [████████░░]  8/10 OVER  Avg: 312.4 yards          │
└─────────────────────────────────────────────────────┘
```

#### Parlay Builder
```
┌─────────────────────────────────────────────────────┐
│  Parlay Builder                                     │
│─────────────────────────────────────────────────────│
│  Leg 1: Mahomes OVER 285.5  [-112]  Grade: A  [✕]   │
│  Leg 2: LeBron OVER 24.5   [-110]  Grade: B  [✕]   │
│  Leg 3: [+ Add a leg...]                            │
│─────────────────────────────────────────────────────│
│  Combined Odds: +312  Parlay Grade: B  78% conf     │
│─────────────────────────────────────────────────────│
│  $100 → $412 potential payout                       │
│  AI: "Both legs have strong independent edges.      │
│  Correlation risk is low. Solid 2-leg ticket."      │
│─────────────────────────────────────────────────────│
│  [Save Parlay]  [Share]  [Track Result]             │
└─────────────────────────────────────────────────────┘
```

---

## 7. Monetization Plan

### 7.1 Tier Structure
| Feature | Free | Pro ($9.99/mo) | Elite ($19.99/mo) |
|---|---|---|---|
| Daily AI picks | 5/day | Unlimited | Unlimited |
| Player props | 5/day | Unlimited | Unlimited |
| Cross-book odds | ❌ | ✅ (5 books) | ✅ (10+ books) |
| Parlay Builder | 2 legs max | Unlimited legs | Unlimited + AI grade |
| Deep AI analysis | Preview only | ✅ Full | ✅ Full |
| Line movement | ❌ | ✅ | ✅ |
| Direct matchups | ❌ | ✅ | ✅ |
| Alerts | ❌ | 3 alerts | Unlimited |
| Pick tracker | ❌ | ✅ | ✅ + ROI analytics |
| Historical trends | Basic | Full | Full |
| Early picks | ❌ | ❌ | ✅ (2hr early) |

### 7.2 Stripe Integration
- Products: `price_pro_monthly`, `price_elite_monthly`
- Annual discounts: 20% off (2 months free)
- Trial: 7-day free trial on Pro
- Webhook events: `customer.subscription.created`, `updated`, `deleted`

---

## 8. Build Sequence (Phases)

### Phase 1 — MVP Web App (Build Now)
- [ ] Auth system (email + Google OAuth)
- [ ] Dashboard with today's picks feed
- [ ] Game & player prop browsing (NFL, NBA, MLB, NCAA)
- [ ] AI analysis engine (Claude API + structured prompts)
- [ ] Odds data integration (The Odds API + ESPN)
- [ ] Free vs. premium tier gating
- [ ] Stripe subscription checkout
- [ ] Parlay builder (with leg management)
- [ ] Basic pick tracker
- [ ] Responsive design (mobile-web ready)

### Phase 2 — Mobile App (React Native)
- [ ] iOS + Android app (shared backend)
- [ ] Push notifications (line movement, injury alerts)
- [ ] Native-feel pick cards and navigation
- [ ] Biometric auth
- [ ] Widget support (iOS)

### Phase 3 — Advanced Features
- [ ] Cross-book real-time odds (upgrade API)
- [ ] Line movement tracking + sharp money indicators
- [ ] Historical backtesting engine
- [ ] Advanced matchup module
- [ ] Community features (public pick leaderboard)

---

## 9. Responsible Gambling & Legal Notes

- **Framing:** Always "educational research tool" — never "guaranteed picks"
- **Disclaimers:** Shown on every AI analysis output
- **Age gate:** 21+ verification on registration
- **Jurisdiction:** Display note that betting availability varies by location
- **API compliance:** Verify The Odds API and Claude API terms for commercial betting applications before production
- **Pick grading:** Confidence % always shows range, not false precision

---

## 10. App Name & Branding

**Recommended Name:** `BetEdge AI`
- Clean, professional, memorable
- "Edge" = the betting concept (finding positive EV)
- "AI" = clear technology positioning
- Domain: `betedgeai.com` (check availability)

**Color Palette:**
- Primary: Deep navy `#0F172A`
- Accent: Electric green `#22C55E` (winning/positive)
- Warning: Amber `#F59E0B` (caution/risk)
- Danger: Red `#EF4444` (avoid/negative)
- Surface: Slate `#1E293B`
- Text: White / Light gray

**Logo concept:** Shield icon with a graph/upward arrow inside — represents protection (smart decisions) + growth (edge).

---

*End of Design Plan — Ready to Build Phase 1*
