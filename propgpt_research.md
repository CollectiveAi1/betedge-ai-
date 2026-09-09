# PropGPT Product Due Diligence and Build Blueprint for a Cross-Platform Sports Betting Analysis Product
*Devon Scott — September 09, 2026*

## Executive Summary

PropGPT is a mobile-first sports betting research assistant published by Orangutech LLC. Its public app-store positioning centers on AI-generated analysis and grades for player props and common game markets. Confirmed or strongly supported coverage includes player props, moneylines, spreads, totals, parlays, real-time statistics, and major leagues such as the NFL, NBA, MLB, WNBA, and NCAA basketball. Public listings also describe fantasy start/sit functionality, while some sources mention additional or planned league coverage that is not consistently confirmed across platforms.

The product’s apparent strength is not a uniquely disclosed predictive method. It is the compression of sports research into a fast, accessible mobile experience: a user selects or discovers a market, receives a grade or confidence-oriented assessment, and reads a short explanation. The public record does not identify PropGPT’s model vendors, source data vendors, model features, probability-calibration method, independently audited performance, or complete web experience. Those items must not be inferred as facts.

PropGPT’s reported App Store rating—approximately 4.8 out of 5 from about 2,400 US ratings—and its approximately 4.7 Google Play rating from more than 380 reviews indicate meaningful consumer interest, but ratings do not validate predictive performance. Positive reviewers say the product simplifies research and helps refine selections. Critical reviews report technical failures, outdated player-team information, shallow analysis, confusing trial or cancellation experiences, and missing workflow controls such as removing an individual parlay leg. These reports are useful product signals, not conclusive proof that every current version has the same deficiencies.

The recommended new product should not merely replicate “AI picks.” It should combine:

1. **Transparent, normalized cross-book odds comparison.**
2. **Direct player-versus-opponent and role-based matchup evidence.**
3. **Editable parlays with removable and replaceable legs.**
4. **First-class NCAA football and basketball coverage.**
5. **A deterministic modeling and calibration layer separated from the language model.**
6. **Evidence-linked explanations showing source, timestamp, book, line, model version, and uncertainty.**
7. **Web and mobile parity for research, saved views, alerts, and tracking.**
8. **A durable free tier, with premium access sold on workflow depth rather than unqualified win claims.**

For the minimum viable product, The Odds API is the clearest documented entry point for multi-book odds because it offers JSON delivery, common markets, selected player props, more than 100 sports, and a public credit-based structure beginning with 500 monthly credits. BALLDONTLIE is a compelling complementary candidate for statistics, injuries, lineups, odds, props, NCAA coverage, and webhooks, but rights, source lineage, historical completeness, and commercial wagering-related use must be verified directly before procurement. CollegeFootballData should be evaluated as a specialized NCAA football and emerging college-basketball source; it offers a free testing key and states that higher tiers support heavier, live, GraphQL, and app-scale workflows.

A decisive constraint is model-provider policy. The supplied OpenAI policy evidence says OpenAI services prohibit real-money gambling and facilitation of sports betting. A sports betting analysis product therefore should not assume GPT-4o can be used in production merely because its structured-output and tool-calling features are technically suitable. The team must obtain written policy confirmation for the precise educational research use case before integrating it. If approval is not obtained, use a compliant alternative or non-LLM template engine. Anthropic documentation confirms Claude tool use and structured outputs, but the available evidence does not establish whether this betting-analysis use case is permitted; written confirmation is also required before production use.

The product must be framed as educational and informational research. It should not promise wins, profit, “locks,” or guaranteed outcomes. Model grades must communicate uncertainty, line sensitivity, and evidence quality. Responsible-gambling controls, age and jurisdiction handling, subscription clarity, privacy controls, and legal review should be launch requirements rather than post-launch additions.

## Decision and Recommended Positioning

Build a cross-platform “evidence-first sports market research” product rather than a black-box picks app.

The core user promise should be:

> Compare the market, inspect the evidence, understand uncertainty, and document the decision.

The product should not claim to know which bets will win. Its principal output should be a traceable research packet containing:

- Current line and price by sportsbook.
- Timestamp and freshness state.
- Consensus and best available price.
- Model probability and fair price, only where a validated deterministic model exists.
- Difference between the market and model.
- Direct matchup, recent-role, injury, lineup, and trend evidence.
- Limitations and missing inputs.
- A calibrated grade tied to a documented probability or edge band.
- A plain-English explanation generated only from supplied facts.
- A permanent snapshot for later grading and backtesting.

The highest-priority differentiation is the combination of PropGPT-like simplicity with OddsJam-, Sharp-, Betstamp-, Pikkit-, and BettingPros-like workflow patterns. The new product should not attempt to match every professional scanning feature at launch. It should make the research chain more inspectable and editable than a simple AI grade.

## Evidence and Confidence Framework

Public evidence is uneven. Official app-store descriptions establish product positioning and platform-level facts, but they do not reveal internal architecture or guarantee that every advertised feature works consistently. Reviews reveal user experiences but can be outdated, version-specific, or unrepresentative.

This report applies four evidence labels:

| Status | Meaning | Product-research treatment |
|---|---|---|
| Confirmed | Supported by an official store listing, official product page, or consistent first-party documentation | May be treated as a current public claim, subject to date and region |
| Strongly supported | Repeated across official and credible secondary descriptions, but implementation details remain unclear | May guide product comparison, with caveats |
| Review-derived | Reported by one or more users or reviewers | Treat as a market signal or test hypothesis, not a guaranteed current condition |
| Inferred | A likely UX or technical design derived from visible functionality, without public confirmation | Use only as a proposed pattern; do not attribute it to PropGPT |

Prices, trials, league availability, sportsbook integrations, and plan entitlements are date-sensitive. They may differ by operating system, country, promotion, or account. All commercial terms should be rechecked in the live product and checkout flow immediately before a procurement or launch decision.

## PropGPT: Feature-by-Feature Product Breakdown

### Overall product and platform

PropGPT is published by Orangutech LLC and is available through Apple’s App Store and Google Play. The Apple listing supports iPhone and iPad, and one listing also identifies compatibility with Apple-silicon Mac devices. The Apple product is rated 18+ because of simulated gambling and requires iOS 15.1 or later according to the captured listing.

The product is best understood as a research assistant, not a sportsbook. The public evidence describes analysis and predictions, but does not say PropGPT accepts wagers. Its differentiated presentation appears to be simplified grades and concise explanations rather than a professional odds-terminal interface.

### Capability matrix

| Capability | Evidence status | What the public evidence supports | Likely user experience and important limits |
|---|---|---|---|
| AI picks and analysis | Confirmed as a public product claim | Store and product descriptions say AI or machine learning is used to produce analysis, predictions, grades, and insights | Users likely receive a directional assessment and short rationale. The model, training data, calibration, and audited accuracy are not publicly established. |
| Player props | Confirmed | Player-prop analysis is repeatedly identified as a core feature | Users likely select a player and statistical market, then evaluate an over or under. Cross-book line coverage and exact prop depth are not fully documented. |
| Game picks | Confirmed | Moneylines, spreads, and game totals are identified in official listings | The user can research common pregame markets. Whether alternate lines, derivatives, quarters, halves, and every market are supported is unverified. |
| Daily picks or curated recommendations | Strongly supported, but exact workflow unverified | Public positioning emphasizes picks and rapid access to analysis; the evidence does not define a formal daily-card quota or schedule | A daily recommendation feed is plausible, but should not be presented as a confirmed named PropGPT feature without current in-app verification. |
| Grades and confidence | Confirmed as presentation | PropGPT publicly promotes grades, confidence levels, or confidence-oriented analysis | Users see an easy-to-scan score or grade. The grade-to-probability mapping, calibration method, and historical reliability are not disclosed. |
| Parlays | Confirmed at a high level | Parlays are included in store and product descriptions | Users can apparently evaluate or work with multiple legs. A review asks for individual-leg removal, indicating that editing may have been limited in at least one version. |
| Odds comparison | Unverified as a robust cross-book feature | The supplied PropGPT evidence references real-time odds but does not establish a dedicated multi-sportsbook line-shopping screen | Do not claim that PropGPT lacks all odds comparison. Treat stronger cross-book comparison as a review- and market-derived opportunity requiring direct product testing. |
| Live or real-time statistics | Confirmed as a public claim | Listings state that real-time statistics or real-time sports data inform the experience | Users may see current statistics during research. Public materials do not disclose latency, refresh intervals, live-betting coverage, or a feed vendor. |
| Direct matchups | Partially supported; depth unverified | Public descriptions refer to matchup context and analysis | Basic opponent context is plausible. Review feedback asks for more granular, current matchup data, making direct player-versus-defender or role-specific views an opportunity rather than a guaranteed PropGPT omission. |
| Injuries | Strongly supported as an analytical input, not fully verified as a standalone screen | Product descriptions associate analysis with external factors such as injuries, but the public UX and source are not documented | Injuries may influence explanations. A dedicated injury feed, timestamps, source attribution, and lineup-impact model remain unverified. |
| Trends and historical form | Confirmed at a general level | Store descriptions mention sports data, historical trends, or trend analysis | Users likely see recent performance summarized into a grade or explanation. Exact windows, opponent adjustments, and sample-size warnings are not public. |
| Fantasy start/sit | Confirmed as a public feature claim | Product materials describe a Fantasy Start/Sit tool | Users can compare lineup decisions or request a recommendation. This is adjacent to the betting workflow rather than essential to the proposed MVP. |
| NCAA coverage | Confirmed in part; breadth varies by source | NCAA basketball appears in Apple-oriented coverage. Some descriptions also mention NCAA football, while a Google listing described plans to expand into NCAA | NCAA coverage should be tested league by league and market by market. The sources are not fully consistent, likely reflecting different dates or platforms. |
| Public performance ledger | Not established | The supplied evidence does not identify a public, independently audited pick-by-pick record or disclosed calibration methodology | Users should not infer predictive validity from app ratings or testimonials. A new product can differentiate with immutable forecasts and post-event grading. |

### How users experience PropGPT’s confirmed value

The apparent interaction model reduces research effort. Instead of manually collecting player statistics, trends, and line information, the user is given a grade and plain-language interpretation. This can be especially attractive to users who do not want to work with spreadsheets or build projection models.

That simplicity creates three product risks:

1. **A grade can look more precise than the evidence warrants.** Without a published mapping from grade to probability and without out-of-sample calibration results, users cannot determine whether an “A” has a consistent empirical meaning.
2. **A recommendation can become stale when a line moves.** An over at one line and price is not equivalent to an over at a worse line or price.
3. **A concise explanation can conceal missing data.** If a roster, injury, or matchup input is outdated, polished language can amplify rather than correct the error.

The proposed product should preserve the fast grade-card experience while exposing line, price, source, freshness, model version, and evidence quality.

### User reception

PropGPT’s captured Apple rating is approximately 4.8 from roughly 2,400 US ratings, while Google Play reports approximately 4.7 from more than 380 reviews. Positive reviews value the accessible analysis and the reduction in manual research. Some reviewers report successful outcomes, but individual testimonials are not controlled performance evidence.

Reported issues include:

- An Evaluate action failing to load.
- Discover returning no search results.
- App crashes or technical instability.
- Outdated player-team affiliations.
- Requests for more current and granular matchup information.
- Requests to remove one leg from a parlay.
- Complaints about trial billing, cancellation visibility, and support responsiveness.

These should become explicit quality-assurance scenarios for a competing product. They should not be described as universal or permanent PropGPT defects.

## Reconstructed UX and Design Journey

No complete, current, publicly verified screen set or interaction specification is available in the supplied evidence. The following journey therefore separates confirmed product behavior from inferred screen design.

### 1. Onboarding

**Confirmed context**

PropGPT is free to download and monetizes premium access through an app-store subscription. A trial may be offered. The product serves both newer and more experienced users and emphasizes simplified analysis.

**Inferred PropGPT journey**

A likely onboarding flow introduces AI analysis, asks the user to select sports or leagues, and presents a subscription trial. The exact number of screens, whether preferences are mandatory, and the timing of the paywall are not publicly confirmed.

**Recommended new-product design**

1. Age and location eligibility notice.
2. Educational/informational framing.
3. Sport selection: NFL, NBA, MLB, NCAA football, NCAA men’s basketball, and other NCAA coverage as data permits.
4. Market preferences: props, spread, moneyline, total, derivatives, parlays.
5. Sportsbook selection for localized odds.
6. Notification choices, all off by default except essential account messages.
7. A clear free-tier preview before any paywall.
8. Trial terms displayed in plain language: trial duration, renewal price, renewal frequency, platform billing, and cancellation path.

Users should be able to skip personalization and explore public research without starting a trial.

### 2. Home or dashboard

**Confirmed context**

PropGPT emphasizes quick access to picks, grades, and analysis. “Discover” is named in reviews, although reports that it returned no results are version-specific.

**Inferred PropGPT journey**

The home screen likely contains sports tabs, recommendations, and cards that can be opened for detailed analysis. “Discover” may provide search or browse behavior.

**Recommended new-product design**

The dashboard should have five modules:

- **Best prices:** largest actionable differences among selected books.
- **Model watchlist:** qualified model-market disagreements, not “guaranteed picks.”
- **News and injury changes:** only sourced and timestamped changes.
- **Saved players, teams, and markets.**
- **Upcoming games:** organized by start time and sport.

Every card should display freshness. A stale state should suppress the grade rather than silently show an old recommendation.

### 3. Pick cards

**Confirmed context**

Grades and concise betting insights are central to PropGPT’s presentation.

**Inferred PropGPT card**

A card likely includes the player or team, market, over/under direction, line, and a grade or confidence assessment. The exact information hierarchy is unverified.

**Recommended card specification**

Each card should contain:

- Sport, league, event, and start time.
- Player or team.
- Bet type and exact selection.
- Book, line, and American or decimal odds.
- Best available comparison and consensus.
- Model fair probability and fair odds, if validated.
- Grade and evidence-quality badge.
- “Updated X minutes ago.”
- Injury or lineup warning.
- Two-sentence summary.
- Save, compare, add to research slip, and open details.

Avoid green “win” styling before settlement. Use neutral colors for research states and reserve result colors for finalized outcomes.

### 4. Filters and search

**Confirmed context**

PropGPT covers multiple leagues and bet types, and reviews reference a Discover search experience.

**Recommended design**

Filters should be server-driven so new leagues and markets can be added without an app release. Support:

- League and date.
- Pregame versus live, if live data is licensed.
- Market family and statistical category.
- Player, team, opponent, and game.
- Sportsbook.
- Minimum data completeness.
- Minimum sample size.
- Model-versus-market difference.
- Injury status.
- Line movement.
- Grade.
- Saved and hidden items.

The product should provide a visible “clear all” action and return partial results when one data source is unavailable.

### 5. Prop details

**Confirmed context**

PropGPT publicly claims player-prop analysis using sports data and real-time statistics.

**Inferred PropGPT detail experience**

A detail screen likely combines a grade, recommendation, recent statistics, and text explanation. Precise charts and tab structure are unverified.

**Recommended detail screen**

Use the following order:

1. **Market header:** selection, book, line, price, timestamp.
2. **Cross-book matrix:** same market across all available books.
3. **Model view:** projected distribution, median, probability by line, fair price, and model version.
4. **Recent role:** minutes, snaps, opportunities, usage, batting-order position, or equivalent provider-supported measures.
5. **Direct matchup:** opponent rank and relevant positional or play-style splits only when sufficiently supported.
6. **Trend table:** full season and recent windows, with sample counts.
7. **Injuries and lineup:** source, status, timestamp, and likely role effect.
8. **Line history:** opening, current, high, and low where licensed.
9. **Explanation:** generated from the preceding structured facts.
10. **Limitations:** missing data, conflicting sources, small samples, or stale feeds.
11. **Audit record:** data and model provenance.

“Hit rate at this line” should not be treated as the sole probability estimate. The quantitative system should account for opponent, role, venue, schedule, and other validated factors only when the requisite data exists.

### 6. Parlay builder

**Review-derived opportunity**

At least one PropGPT review requested individual-leg removal. This indicates a workflow problem in one observed version, not a guaranteed current omission.

**Recommended design**

The research slip should allow users to:

- Add, remove, reorder, or replace any leg.
- See each leg’s line and timestamp.
- Detect duplicate, contradictory, or correlated legs.
- Recalculate combined estimates after every edit.
- Mark correlation as modeled, unknown, or unsupported.
- Save a parlay research scenario without transmitting a wager.
- Compare offered parlay pricing only when properly licensed.

Do not compute a combined probability by naively multiplying legs when correlation is present or unknown.

### 7. Paywall and account management

**Confirmed context**

PropGPT is free to download but restricts advanced access through subscriptions. The most consistently reported price is $9.99 per week, with possible free-trial access and regional variation. Reviews include complaints about cancellation visibility and billing.

**Recommended design**

The paywall should list exact feature differences. It should show renewal cadence at the same visual prominence as the price. Account settings should contain:

- Current plan.
- Trial end date.
- Next renewal date and amount.
- “Manage subscription” deep link for Apple or Google billing.
- Cancellation instructions.
- Export and delete-account controls.
- Support contact with delivery monitoring.
- Purchase-restoration action.

### 8. Notifications

**PropGPT evidence status: inferred**

The available materials do not establish a complete PropGPT notification taxonomy.

**Recommended design**

Offer granular controls for:

- Line reaches a saved threshold.
- Best price changes.
- Injury or lineup status changes.
- Game approaching.
- Market suspended or removed.
- Grade materially changes.
- Saved result finalized.
- Trial ending and subscription renewing.

A grade-change alert must explain what changed. For example: “The line moved from 7.5 to 8.5,” or “Player status changed to questionable.” Avoid urgency language such as “bet now” or “can’t miss.”

## PropGPT Monetization and Commercial Terms

### What is publicly supported

PropGPT is free to download and uses in-app subscriptions. The best-supported captured offer is $9.99 per week. Trial access is mentioned in Apple-, Google-, and secondary product materials. Premium features are described as including fuller AI analysis, grades or picks, advanced insights, real-time statistics, and player-prop tools.

The evidence does not provide a stable, complete entitlement table separating every free and paid feature. It also does not establish a universal trial duration, annual option, refund policy, or web subscription. These terms should be verified in the relevant store and region on the date of purchase.

### Cancellation and billing caveat

App-store subscription management appears to be handled through Apple or Google. Several Google Play reviewers reported difficulty locating cancellation controls, unexpected charges, or support problems. These are user reports rather than adjudicated findings.

A new product should treat subscription trust as a differentiator:

- Do not hide the renewal frequency.
- Send a trial-ending reminder where legally and technically permitted.
- Provide a direct platform subscription-management link.
- Maintain tested support inboxes.
- Acknowledge billing tickets automatically.
- Publish concise cancellation instructions before purchase.
- Avoid presenting weekly pricing in a way that obscures cumulative cost.

### Recommended new-product packaging

Exact launch prices require willingness-to-pay testing; the evidence supports product patterns, not an optimal price. A reasonable packaging structure is:

**Free**

- Limited daily research cards.
- Delayed or lower-frequency odds.
- Basic event, team, and player pages.
- A limited number of saved alerts.
- Basic trends with visible sample sizes.
- Manual research-slip creation.
- Settled-result history for the product’s published forecasts.

**Premium**

- Faster odds refresh.
- Full cross-book comparison.
- Full prop details and model distributions.
- Line history.
- Injury and lineup alerts.
- Advanced matchup filters.
- Editable parlay research and correlation warnings.
- Exportable tracking and custom dashboards.
- Full NCAA coverage where licensed.
- No advertising, if ads are otherwise used.

The premium proposition should be “more data, speed, workflow, and transparency,” not “more guaranteed winners.”

## Competitive Landscape

### Comparison criteria

The relevant competitive axes are:

- Odds breadth and freshness.
- Props and market depth.
- Automatic bet tracking.
- Research and prediction presentation.
- Social/community features.
- Professional +EV or arbitrage tooling.
- Web/mobile parity.
- Price accessibility.
- Transparency and auditability.

### Competitive comparison

| Product | Best-supported positioning | Odds and props | Tracking and community | Publicly captured pricing | Best-in-class lesson and caveats |
|---|---|---|---|---|---|
| BettingPros | Accessible all-in-one research, odds, expert content, AI assistance, and tracking | Official materials describe odds comparison, prop analysis, historical hit rates, and market-based EV tools | Sportsbook syncing and automated tracking are supported; expert and community features are part of the broader proposition | Premium starts at $9.99 per month on an official page; other captured sources report $29.99 monthly or $119.99 annually, suggesting offer or tier variation | Best pattern: combine research, consensus, odds, and personal tracking in one approachable product. Verify current tier entitlements. |
| Pikkit | Social-first, automated multi-book bet tracker | Pro includes SGP line shopping, odds alerts, and market-open alerts | BookSync imports bets from more than 30 platforms; social following, copying, privacy controls, and analytics are central | Free core tracking; Pro captured at $29.99 monthly or $199.99 annually with a seven-day trial | Best pattern: frictionless ledger plus privacy-aware social proof. Reported inability to enter unsupported bets manually is a potential limitation in the supplied findings. |
| Betstamp | Odds comparison and performance tracking for consumers, with a separate professional product | Consumer materials state comparison across more than 50 partners. Betstamp PRO claims coverage exceeding 200 books and sub-second refreshes | Manual tracking, automatic grading, ROI and CLV analysis; BetLink provides automated synchronization | Consumer pricing is not clearly established in the supplied official documentation. Betstamp PRO Main starts at $249 per month; props and live tiers require sales contact | Best pattern: combine line shopping, CLV, and a durable ledger. The professional “True Line” methodology is proprietary and should not be copied or treated as independently validated. |
| Sharp App | Advantage-betting toolkit emphasizing arbitrage, +EV, props, and market intelligence | Claims more than 100 sportsbooks, de-vigged consensus grading, Proptimizer, and live tools | Includes bet tracking, alerts, community access, and workflow support | Core $69.99 monthly; Ultimate $179.99 monthly; seven-day trial and cancellation at any time are stated | Best pattern: unify top-down market data with bottom-up projections. Exact refresh and feature differences should be verified because supplied summaries differ on whether Core data is real-time or delayed. |
| OddsJam | Professional odds intelligence focused on arbitrage, +EV, low-hold, middles, and price discovery | Claims data from more than 150 books and processing of more than one million odds per minute | Provides a free tracker, automatic grading, CLV, calculators, education, and 24/7 chat | Captured third-party pricing ranges widely from about $39 to $999 monthly, while official supplied pages say plans vary. Verify directly | Best pattern: make price comparison and execution speed primary. It is a high-complexity benchmark, not the right complete MVP template. |
| PropGPT | Mobile-first, simplified AI grades and explanations | Supports props and common game markets; robust cross-book comparison is not established | No public evidence of deep automatic bet tracking or social functionality in the supplied data | Free download; commonly captured at $9.99 weekly, with possible trial and regional variation | Best pattern: low-friction explanations and grades. Opportunity: add transparent pricing, provenance, editable parlays, and broader market context. |

### Areas of conflicting or variable evidence

#### BettingPros pricing

One captured set reports Premium at $29.99 monthly or $119.99 annually, while an official BettingPros page says premium access starts at $9.99 monthly. The best interpretation is tier, billing-cycle, or promotional variation. The report should not collapse these into one universal price.

#### Sharp App data speed

One captured comparison says Core may have an approximately 30-second delay and Ultimate offers sub-second streaming. An official Sharp page describes Core as including real-time tools. This may reflect changed plans or different definitions of “real-time.” Buyers should verify endpoint or screen latency contractually.

#### Betstamp consumer versus professional scope

Betstamp’s consumer product emphasizes free or accessible odds comparison and tracking, while Betstamp PRO starts at $249 monthly and separates props and live access into sales-led tiers. These are materially different products and should not be compared as one uniform subscription.

#### OddsJam pricing

The captured official materials confirm multiple plans but do not supply a stable complete price table. Third-party ranges are broad. Current pricing should be obtained from OddsJam directly.

### Best-in-class patterns to adopt

1. **BettingPros:** A single surface for research, odds, and personal history.
2. **Pikkit:** Read-only synchronization, privacy controls, and engaging progress views.
3. **Betstamp:** CLV-oriented auditability and powerful market filtering.
4. **Sharp App:** Integration of market consensus with statistical projections.
5. **OddsJam:** Speed, line shopping, calculators, and explicit market mechanics.
6. **PropGPT:** Fast, understandable mobile cards for non-specialists.

The product should not launch with arbitrage marketing or claims of guaranteed profit. Although competitors describe arbitrage in those terms, such positioning creates policy, compliance, responsible-gambling, and user-expectation risks.

## Data and API Procurement

### Procurement principles

No single supplied provider is conclusively shown to deliver every required league, every bet type, complete historical data, injuries, depth charts, real-time play-by-play, and all player props under affordable commercial rights.

The architecture should therefore assume multiple providers and prevent vendor-specific identifiers from entering the product domain. Procurement must assess:

- Commercial display and redistribution rights.
- Use in sports betting analysis.
- League and market coverage.
- Book and jurisdiction coverage.
- Player-prop depth.
- Historical snapshots rather than only current odds.
- Injury, lineup, roster, and transaction freshness.
- Rate limits and burst behavior.
- Webhook or streaming availability.
- Correction policy and source lineage.
- Service-level commitments.
- Caching and retention rights.
- Attribution requirements.
- Mobile and web display rights.
- Model-training and derived-data rights.

### Provider comparison

| Provider | Supported role based on supplied evidence | Public price or access facts | Strengths | Critical verification points |
|---|---|---|---|---|
| The Odds API | MVP odds aggregation | 500 free monthly credits; captured paid tiers run from $30 for 20,000 credits to $249 for 15 million credits. Odds-call cost depends on markets multiplied by regions; historical calls can cost 10 times the standard rate | JSON, American and decimal formats, 100+ sports, common markets, selected props, straightforward REST integration | Exact bookmaker count and plan table vary across supplied summaries. Confirm NFL/NBA/MLB/NCAA prop inventory, update latency, historical retention, and commercial display rights. |
| Unofficial ESPN endpoints | Prototype enrichment and fallback discovery only | No official pricing or support is established; endpoints require no authentication in the supplied evidence | Scores, standings, news, and player statistics across many sports and leagues | Undocumented and unsupported; may change without notice. Caching, blocking risk, data rights, and commercial use make this unsuitable as a production dependency without permission. |
| MySportsFeeds | Statistics, scores, play-by-play, lineups, and injuries for major professional leagues | Personal use may be free or low cost. Captured commercial non-live plans often start around $25–$49 per league per month; current commercial terms must be verified | NFL, MLB, NBA, NHL; REST; JSON, XML, CSV; wrappers in several languages; live updates may occur every few seconds | Independent, crowd-assisted data model; verify corrections, NCAA availability, betting use, latency commitments, and source rights. |
| SportsDataIO | Advanced commercial all-in-one candidate | Free evaluation uses scrambled data. Discovery Lab is captured at $99–$149 monthly or $599–$899 annually with real but next-day data. Production is quote-based | Broad sports coverage, developer portal, dictionaries, OpenAPI, simulations, and commercial real-time feeds | Production cost, exact NCAA and prop rights, latency SLA, retention, and derived-model rights. Discovery Lab is not appropriate for a live consumer product because it is next-day delayed. |
| BALLDONTLIE | Attractive unified stats, odds, props, injury, NCAA, and webhook candidate | Free: one sport and five requests/minute. All-Star: $9.99 per month per sport and 60 requests/minute. GOAT: $39.99 per month per sport and 600 requests/minute. All-Access: $299.99 monthly for 20+ sports, full access, 600 requests/minute, and 500,000 webhooks; a 48-hour trial is stated | Claims NFL, NBA, MLB, NCAAF, NCAAB, odds, props, injuries, lineups, historical data, OpenAPI, and webhooks | Data is offered on a best-effort basis and should be verified for time-critical decisions. Confirm book inventory, historical completeness, commercial rights, webhook latency, corrections, and NCAA market depth. |
| Tank01 via RapidAPI | Low-cost prototyping and fantasy/live stat enrichment | Captured tiers per API include free 1,000 hits/month; $10 monthly for 1,000 daily; $25 for 15,000 daily; and $100 for 500,000 daily, with stated overage terms | Live box scores, fantasy projections, rosters, and some betting odds for major professional leagues | Pricing may be per league or API. Confirm NCAA support, props, rights, reliability, normalization, and whether RapidAPI terms permit production display and retention. |
| CollegeFootballData | Specialist source for college football and emerging college basketball | Free testing key; paid downloadable packs and Patreon API tiers. The 2026 CFB Starter Pack is listed at $49 and AI API Launchpad at $19, but these are educational packs rather than necessarily production licenses | Historical and schedule workflows, exporter, analytics resources, higher-tier live and app-scale access; college basketball API is now stated as available | Confirm production API pricing, live-game SLA, basketball breadth, commercial redistribution, injuries, rosters, odds, and props. |
| SportsGameOdds | Alternative odds and props candidate | Public findings describe object-based billing but do not provide an exact current plan table | Claims 67+ leagues, 85+ bookmakers, DFS lines, and prediction markets | Verify exact NFL/NBA/MLB/NCAA player props, latency, historical odds, book list, and commercial terms. |
| OpticOdds | Potential advanced real-time provider | No exact supported price is available in the supplied evidence | Identified as an alternative for broader bookmaker coverage and higher-frequency requirements | Obtain a direct proposal covering streaming, props, history, rights, SLA, and redistribution. |
| Sportradar | Advanced enterprise path | No public production price is supplied | Professional player-prop comparison coverage is described for NFL, NBA, MLB, NHL, and NCAA football | Quote, rights, geographic restrictions, attribution, latency, data retention, and model-training terms. |

### Other viable freemium alternatives

The supplied evidence identifies OddsPapi, Odds-API.io, Sports API services, BigBallsData, Highlightly, and SportsbookAPI as additional market participants. It does not provide enough consistent official detail to recommend them over the providers above. They should enter a structured request-for-information process rather than be treated as interchangeable feeds.

For each, require a sample payload and a 14- to 30-day parallel test covering:

- Market availability by league.
- Player resolution.
- Duplicate-event rate.
- Odds update intervals.
- Suspended-market handling.
- Corrections.
- Missing-price rate.
- Historical snapshots.
- NCAA team-name and venue normalization.
- Injury and roster lag.
- Contractual commercial rights.

### Recommended MVP data stack

#### Primary recommendation

1. **The Odds API** for initial pregame odds and selected props.
2. **BALLDONTLIE** for statistics, injuries, lineups, and supplemental odds/props where coverage and commercial rights pass validation.
3. **CollegeFootballData** for NCAA football modeling and college-basketball evaluation.
4. **A provider-neutral ingestion and canonicalization layer** from day one.
5. **No production dependency on unofficial ESPN endpoints.** Use only in isolated prototypes unless permission and terms are resolved.

This combination offers the clearest low-cost path in the supplied evidence. It is not guaranteed to satisfy “all bet types.” Before committing to launch scope, run a coverage audit against actual target markets for NFL, NBA, MLB, NCAAF, and NCAAB.

#### Advanced path

Migrate latency-sensitive odds and deeper props to an enterprise provider such as SportsDataIO, OpticOdds, SportsGameOdds, Sportradar, or another contractually validated source. Keep the initial providers as fallback or enrichment feeds where contracts permit.

### Data normalization abstraction

Create canonical entities independent of any provider:

- `Sport`
- `League`
- `Season`
- `Team`
- `Player`
- `Venue`
- `Event`
- `Sportsbook`
- `MarketType`
- `Market`
- `Outcome`
- `OddsQuote`
- `PlayerProp`
- `InjuryReport`
- `RosterMembership`
- `Lineup`
- `StatObservation`
- `ModelForecast`
- `Explanation`
- `ResearchSlip`
- `Settlement`

Every source record should retain:

- Provider name.
- Provider entity ID.
- Ingested timestamp.
- Provider’s source timestamp.
- Effective timestamp.
- Raw payload hash.
- Schema version.
- Canonical mapping confidence.
- Correction or supersession link.

An `OddsQuote` should never be overwritten. Store append-only snapshots containing event, sportsbook, market key, outcome, line, price, status, and timestamps. This is necessary for line history, backtests, forecast audits, and CLV calculations.

Provider adapters should map source-specific nomenclature into canonical market keys. Unknown markets should be quarantined rather than silently mapped.

### Polling and freshness plan

The precise plan must respect provider rate limits and contracts.

**Pregame events more than 24 hours away**

- Poll core game markets every 15–30 minutes.
- Poll deep props less frequently until markets open.
- Refresh injuries and rosters every 30–60 minutes.

**Events within 24 hours**

- Poll game markets every 2–5 minutes.
- Poll props every 3–10 minutes depending on limits.
- Poll injuries and lineups every 5–15 minutes.

**Final 60 minutes before start**

- Poll active odds every 15–60 seconds where the plan and provider permit.
- Prefer webhooks or streaming when available.
- Refresh lineups and injuries immediately on a provider event.

**Live events**

Do not offer a live analysis product until a licensed provider supplies adequate latency, suspension states, and service guarantees. SportsDataIO recommends synchronization as often as every 3–5 seconds for scores and play-by-play, 5–10 seconds for odds, and five minutes for injuries for relevant real-time subscribers. Those intervals demonstrate that a live product requires a materially different data and infrastructure budget from a pregame MVP.

**Freshness policy**

- Display the provider timestamp and local receipt time.
- Mark an item “aging” after its market-specific threshold.
- Suppress grades when critical inputs exceed a hard stale threshold.
- Never send an alert from a stale snapshot.
- Recalculate when line, price, injury, lineup, or event status changes materially.
- Maintain provider health scores and fallback priority.

### Legal and terms risks

The team must obtain specialist legal review before launch. At minimum, investigate:

- Whether each provider permits consumer display in a betting-analysis context.
- Whether odds and statistical data may be cached, stored historically, or used to train models.
- Whether team, league, and player identifiers or marks can be displayed.
- Whether sportsbook logos and affiliate links require permission.
- Jurisdiction-specific age, advertising, and disclosure rules.
- Whether automatic bet syncing is allowed by sportsbook terms.
- Whether deep-linking or bet-slip prefilling is considered facilitation.
- Whether live data can be redistributed to mobile clients.
- Whether NCAA athlete data creates additional policy or product-risk considerations.
- Whether model-provider policies permit the exact use case.

The undocumented ESPN endpoints are especially risky because the evidence says they may change without notice and are not officially supported. Technical accessibility is not permission.

## Proposed Technical Architecture

### Confirmed public facts about PropGPT

The public record supports only a limited technical description:

- PropGPT claims to use AI or machine learning.
- It claims to process sports data and real-time statistics.
- It delivers mobile applications through Apple and Google.
- It provides grades, predictions, or insights.
- Public listings indicate collection of some usage data for analytics or tracking.

The record does not identify:

- Cloud vendor.
- Database.
- Data-feed provider.
- Model vendor.
- Model family or version.
- Training procedure.
- Feature store.
- Realtime transport.
- Refresh frequency.
- Backtesting framework.
- Probability calibration.
- Monitoring stack.
- Web frontend.
- Audited accuracy.

No such details should be attributed to PropGPT.

### Likely architecture class, explicitly inferred

A product with PropGPT’s advertised capabilities would ordinarily require an ingestion service, entity normalization, statistical features, a predictive or grading service, an explanation service, and mobile-facing APIs. This is a functional inference, not a description of PropGPT’s implementation.

### Recommended architecture for the new product

#### Client layer

- Responsive web application.
- Native or shared-code iOS and Android clients.
- Common design system and analytics taxonomy.
- Local caching for saved research, not stale market recommendations.
- Deep links into event, player, prop, and alert screens.

#### Edge and API layer

- Authenticated client API.
- Rate limiting and abuse controls.
- Server-side feature flags.
- Region, age, and subscription-entitlement checks.
- No direct exposure of provider keys.
- Response-level freshness metadata.

#### Ingestion layer

- Provider adapters.
- Scheduled polling workers.
- Webhook receivers.
- Raw immutable payload store.
- Dead-letter queue for malformed or unmapped records.
- Provider status and latency telemetry.

#### Domain and storage layer

- Canonical relational store for entities and product state.
- Time-series or append-optimized storage for odds snapshots.
- Object storage for raw payloads and model artifacts.
- Cache for current event and market views.
- Search index for players, teams, and markets.
- Feature store or versioned analytical tables for model inputs.

#### Quantitative layer

- Sport- and market-specific deterministic models.
- Implied-probability and de-vig calculations.
- Projection distributions.
- Calibration service.
- Backtest and settlement service.
- Model registry.
- Forecast snapshot ledger.

#### Language layer

- Retrieval and fact assembly.
- Provider-policy-compliant LLM or deterministic template renderer.
- Structured output validation.
- Citation and provenance attachment.
- Prohibited-language and responsible-UX checks.
- Explanation caching keyed to the exact forecast and odds snapshot.

#### Notification layer

- User watch rules.
- Event-driven recalculation.
- Deduplication and cooldowns.
- Push, email, and in-app delivery.
- Regulatory and responsible-use suppression rules.

#### Observability

- Provider latency and missing-data dashboards.
- Mapping-error rates.
- Model drift and calibration.
- Explanation faithfulness.
- Alert delivery and false-alert rates.
- Subscription and support events.
- Full audit trail from displayed statement to source record.

## Quantitative Modeling and LLM Strategy

### Governing principle

The LLM should explain, summarize, query, and audit structured evidence. It should not be the core predictive engine.

A language model is poorly suited to silently deriving probabilities from mixed prose, recent games, injuries, and odds. It can produce fluent but unsupported certainty. Research shows that LLM verbal confidence is sensitive to prompting and can be overconfident; chain-of-thought-style reasoning can increase confidence even when an answer is wrong.

Use deterministic and statistically evaluated systems for:

- Feature engineering.
- Projections.
- Simulations.
- Probability distributions.
- De-vigging.
- Fair-price calculations.
- Grade assignment.
- Backtesting.
- Calibration.
- Settlement.

Use the LLM for:

- Explaining a model output.
- Summarizing sourced injury and matchup evidence.
- Comparing options already calculated by tools.
- Identifying missing or contradictory inputs.
- Producing a user-specific explanation depth.
- Answering research questions from approved facts.
- Converting structured facts into consistent mobile copy.

### Provider policy gate

OpenAI documentation supports technically useful features such as GPT-4o structured outputs, strict JSON schemas, and function calling. However, the supplied OpenAI policy evidence says real-money gambling, sportsbooks, and facilitation of sports betting are prohibited uses. This is a launch blocker unless OpenAI provides written approval for the proposed informational implementation.

The team should submit a precise description covering:

- No wager acceptance.
- No custody of funds.
- No sportsbook account action by the model.
- No bet placement.
- Educational and informational framing.
- Quantitative forecasts produced outside the LLM.
- Responsible-gambling controls.
- Age and region controls.
- No personalized staking instructions.
- No promises of profit.

Written approval, not an informal interpretation, should govern the decision.

Anthropic’s native API supports JSON-schema tools, strict tool use, and structured outputs. The available research does not state whether Claude permits sports betting analysis. Obtain written approval before using Claude. Anthropic also warns that its OpenAI-compatible layer ignores strict function-calling enforcement; native Claude APIs should be used where schema guarantees matter.

If neither provider authorizes the use case, deploy deterministic templates or another contractually approved language technology.

### Structured input contract

The language layer should never receive an unbounded instruction such as “Pick the best NBA bets tonight.” It should receive a bounded object such as:

```text
analysis_request
- request_id
- user_locale
- educational_mode
- league
- event
- market_snapshot
  - sportsbook
  - market
  - selection
  - line
  - odds
  - source_timestamp
- model_forecast
  - model_id
  - model_version
  - generated_at
  - projected_mean
  - projected_distribution_summary
  - probability
  - calibrated_probability
  - fair_odds
  - validation_sample
- evidence
  - recent_role
  - matchup
  - injuries
  - lineup
  - line_movement
- data_quality
  - missing_fields
  - stale_fields
  - conflicts
- allowed_claims
- prohibited_claims
```

The model must be forbidden from introducing facts not present in this packet.

### Tool and function design

A policy-approved implementation can expose read-only tools:

- `get_event_snapshot`
- `get_cross_book_odds`
- `get_player_role_metrics`
- `get_matchup_metrics`
- `get_injury_reports`
- `get_lineup_status`
- `get_line_history`
- `get_model_forecast`
- `get_model_validation`
- `get_forecast_ledger`
- `compare_research_slip_legs`

OpenAI function calling uses JSON-schema parameter definitions, and strict mode can enforce schema-compliant arguments. Anthropic tools similarly use JSON Schema; detailed descriptions are important, and strict tool use can enforce input conformance.

Tools must be read-only. Do not expose wager placement, deposit, withdrawal, account access, or automatic staking functions.

### Structured output contract

Require a schema containing:

- `market_summary`
- `directional_view`
- `grade`
- `calibrated_probability`
- `evidence_for`
- `evidence_against`
- `line_sensitivity`
- `data_limitations`
- `provenance_ids`
- `freshness_warning`
- `responsible_use_notice`
- `abstain`
- `abstain_reason`

OpenAI Structured Outputs can enforce a supplied JSON schema, and SDKs support schema definitions through Pydantic or Zod. Anthropic Structured Outputs and strict tool use provide corresponding schema-conformance mechanisms.

Schema validity does not prove factual validity. Every claim still must be checked against the input packet.

### RAG and fact injection

The RAG index should contain controlled, time-bounded materials:

- Current provider records.
- Model cards and validation reports.
- Market definitions.
- Injury and lineup records.
- Team and player identity mappings.
- Product help content.
- Responsible-gambling resources approved for the user’s jurisdiction.
- Subscription and cancellation terms.

Do not retrieve unsourced social posts or arbitrary betting content into production explanations.

Evaluate RAG at two levels:

1. **Retrieval:** Did the system fetch the correct, current evidence?
2. **Generation:** Did the explanation remain faithful, relevant, and complete?

Research cautions that RAG metrics may not transfer reliably across datasets and that irrelevant or adversarial retrieved content can degrade output while preserving high confidence. Evaluation must therefore use sports-specific, time-sensitive test cases.

### Prompt pattern

A suitable system pattern is:

> You are an evidence-constrained sports research explainer. Use only supplied structured facts and tool results. Do not invent statistics, injuries, lineup status, odds, sportsbook availability, model performance, or causal explanations. Do not promise wins, profit, or certainty. Do not recommend stake size. State both supporting and opposing evidence. If critical data is stale, conflicting, missing, or outside model validation, abstain. Preserve source identifiers and timestamps in the output schema.

A request template can add:

> Explain why the deterministic model assigned this grade at the exact listed line and price. Identify the strongest evidence for and against the view. Explain how the assessment changes if the line moves by the supplied increments. Do not recalculate probabilities; use the model-service values.

### Deterministic grade system

Grades should derive from explicit quantitative and data-quality rules, not from LLM sentiment.

An illustrative framework:

- **No grade:** Data stale, player identity unresolved, event status uncertain, unsupported market, or insufficient validation.
- **C:** Forecast approximately aligned with market or evidence is incomplete.
- **B:** Moderate model-market difference with acceptable data quality.
- **A:** Larger validated difference with strong input completeness and adequate historical calibration.
- **A+ or equivalent:** Avoid at launch unless sample size and calibration justify a distinct band.

The exact thresholds must be learned from validation data and documented per league and market. A grade must be line-specific and price-specific. It expires when inputs move beyond defined tolerances.

Display components separately:

- Model edge band.
- Data-quality score.
- Market-liquidity or coverage state, where available.
- Calibration state.
- Explanation confidence.

Do not use the LLM’s self-reported confidence as the grade. Verbalized confidence is sensitive to prompt wording and protocol.

### Calibration and backtesting

For each league-market model:

1. Split historical data in time order.
2. Prevent future roster, injury, line, and outcome data from entering past forecasts.
3. Reconstruct the market as it existed at the forecast timestamp.
4. Freeze every prediction before settlement.
5. Evaluate probability accuracy and line sensitivity.
6. Calibrate on data not used to fit the base model.
7. Report results by season, league, market, probability band, book availability, and time to event.
8. Re-run after material model or provider changes.

Metrics supported by the supplied research include Expected Calibration Error, Brier score, negative log-likelihood, and accuracy or outcome quality by confidence band. For betting-market research, also record closing-line comparisons where licensed, but do not substitute CLV for outcome calibration.

Use selective prediction: abstain when forecast confidence, evidence quality, or source agreement falls below threshold. Research supports calibrated cascades and abstention for ambiguous cases.

### Explanation evaluation

Create a minimum viable evaluation suite with:

- Stale odds.
- Player traded to another team.
- Duplicate names.
- Conflicting injury reports.
- Line movement after forecast generation.
- Postponed or cancelled games.
- NCAA team-name aliases.
- Props with changed definitions.
- Correlated parlay legs.
- Missing direct-matchup data.
- Strong trend but low sample size.
- Model forecast that contradicts recent results.
- Provider outage.
- Adversarial text in retrieved content.

Measure:

- Unsupported-claim rate.
- Citation completeness.
- Timestamp accuracy.
- Correct abstention.
- Grade fidelity.
- Line and price fidelity.
- Explanation consistency.
- User comprehension.
- Responsible-language compliance.

Follow an iterative “define, test, diagnose, fix” evaluation loop rather than relying on anecdotal outputs.

### Provenance and safe UX

Every explanation should offer an expandable “Why am I seeing this?” panel containing:

- Forecast timestamp.
- Odds timestamp.
- Sportsbook and market.
- Data providers.
- Model name and version.
- Relevant evidence IDs.
- Historical validation window.
- Known limitations.
- Whether an LLM or template generated the text.

Never show:

- “Guaranteed.”
- “Risk-free.”
- “Lock.”
- “Can’t lose.”
- “Sure thing.”
- Unqualified ROI or win-rate projections.
- Personalized instructions to recover losses.
- Stake sizes generated from user losses or emotional state.

## Differentiation Strategy

### Priority 1: Cross-book, line-specific analysis

The most consequential opportunity is to tie every analysis to a book, line, price, and timestamp. The supplied evidence does not establish PropGPT as a robust odds-shopping product, while BettingPros, Betstamp, Sharp, and OddsJam make comparison central.

The new product should show how the grade changes across books. A prop should not have one universal grade if one book lists a different line or price.

### Priority 2: Direct matchup and role context

Review feedback suggests demand for more granular matchup data. Build player detail around role and opportunity first, then opponent context. Do not manufacture direct-matchup claims when only broad team defense data is available.

For each insight, label the analytical level:

- Player-specific historical matchup.
- Position-versus-opponent.
- Team-versus-play type or category.
- General opponent rank.
- No reliable matchup data.

### Priority 3: Editable parlay research

Review-derived feedback identifies individual-leg removal as a desired improvement. Make the parlay workspace fully editable and transparent.

Differentiate by explaining:

- Which leg changed.
- Whether correlation is known.
- Whether any price is stale.
- Whether one leg dominates estimated risk.
- Whether the combined estimate is unavailable due to unsupported dependence.

### Priority 4: NCAA as a first-class domain

Source descriptions conflict on the depth and timing of PropGPT’s NCAA expansion. Treat NCAA breadth as an opportunity, not a guaranteed competitor omission.

The product should explicitly separate:

- NCAAF.
- NCAAB.
- NCAAW if data permits.
- Conference and division mappings.
- Neutral-site games.
- Roster and transfer changes.
- Market availability by sportsbook.

CollegeFootballData states that the same key now supports a college-basketball API and that higher tiers serve live and app-scale workflows. This makes it a strong evaluation candidate, not a complete production answer by itself.

### Priority 5: Public model and forecast ledger

Publish every qualifying forecast before the event with:

- Exact market snapshot.
- Model version.
- Probability.
- Grade.
- Data-quality state.
- Later outcome.
- Closing line where licensed.
- Corrections without deletion.

This directly addresses the absence of a clearly documented, independently audited PropGPT performance record in the supplied evidence.

### Priority 6: Subscription trust

Use clear trial and cancellation UX to turn a category weakness into retention strength. PropGPT reviews specifically surface billing and cancellation concerns. Subscription trust should be measured as a product KPI.

### Priority 7: Web/mobile parity

PropGPT’s documented strength is mobile availability. The new product should add a serious web workspace while keeping mobile cards concise. Saved views, alerts, forecasts, and account state should remain synchronized across platforms.

## Phased Roadmap

### Phase 0: Policy, rights, and data proof

**Goal:** Establish whether the product can legally and contractually operate.

Deliverables:

- Written opinions on product classification, jurisdictions, age handling, and marketing.
- Model-provider written approval or a non-LLM fallback decision.
- Data-provider rights matrix.
- Four-week feed quality audit.
- Canonical event, team, player, market, and odds schema.
- Responsible-gambling requirements.
- Subscription disclosure specification.
- Initial model cards and evaluation plan.

Exit criteria:

- Commercial rights confirmed.
- Required NFL, NBA, MLB, NCAAF, and NCAAB event coverage demonstrated.
- Target prop inventory measured.
- No unresolved blocker on LLM provider policy.
- Fallback architecture approved.

### Phase 1: Pregame research MVP

**Scope**

- Web, iOS, and Android.
- NFL, NBA, MLB, NCAAF, and NCAAB.
- Pregame moneyline, spread, total, and supported player props.
- Multi-book odds comparison.
- Event, team, player, and prop pages.
- Deterministic forecasts for a deliberately limited set of validated markets.
- Transparent grades.
- Saved items and basic alerts.
- Free and premium entitlements.
- Public forecast ledger.
- Clear subscription controls.

“All bet types” should be interpreted as a product taxonomy and expansion target, not a promise that every market from every sportsbook will be present on day one. The UI should gracefully display unsupported markets and provider coverage gaps.

### Phase 2: Research depth and personalization

- Line history.
- Advanced direct-matchup views.
- Injury and lineup change explanations.
- Configurable dashboard.
- More player-prop categories.
- Exportable research and forecast history.
- Editable parlay research slip.
- Correlation warnings.
- More NCAA conferences and women’s basketball if data and demand justify it.
- Controlled natural-language research assistant, only with provider approval.

### Phase 3: Tracking and community

- Manual bet or forecast tracking.
- Optional read-only sportsbook synchronization after terms review.
- CLV and performance analytics.
- Private groups.
- Privacy-preserving unit display.
- Expert or model-following features.
- Moderation and misinformation controls.

Pikkit’s read-only synchronization, privacy options, and free core tracking provide a useful pattern. Do not require users to expose monetary amounts socially.

### Phase 4: Advanced market intelligence

- Enterprise streaming odds.
- Deeper alternate and derivative markets.
- Advanced fair-price estimation.
- Broader sportsbook coverage.
- Professional alerting.
- Live analysis only after licensed low-latency data, suspension handling, and operational readiness.
- Advanced parlay pricing only with validated correlation models and appropriate rights.

Do not prioritize live arbitrage or automated execution before the product has demonstrated data quality, compliance, and responsible use.

## KPI and Experimentation Framework

### North-star metric

Use **weekly users completing an evidence-reviewed research session**, defined as a user who:

1. Opens a market detail.
2. Views at least one comparison or evidence section.
3. Sees the freshness state.
4. Saves, dismisses, or documents a decision.

This emphasizes informed research rather than wager volume.

### Data and reliability KPIs

- Odds snapshot freshness by league and provider.
- Percentage of events with complete book coverage.
- Prop mapping success.
- Player and team identity conflict rate.
- Injury and roster update lag.
- Stale-grade suppression rate.
- Provider outage recovery time.
- Settlement accuracy.
- Forecast reproducibility.
- Alert correctness and timeliness.

### Model KPIs

- Brier score.
- Expected Calibration Error.
- Negative log-likelihood.
- Accuracy by probability band.
- Abstention rate.
- Coverage at each grade.
- Performance by league, market, and time to event.
- Calibration drift after provider or model changes.
- Difference between frozen forecast and closing market where licensed.

Do not optimize solely for raw win rate because odds, market selection, and forecast confidence matter.

### Explanation KPIs

- Unsupported factual claim rate.
- Provenance-link completeness.
- Correct line and price reproduction.
- Correctly stated limitations.
- Abstention precision and recall.
- User comprehension.
- Explanation helpfulness.
- Latency.
- Cost per explanation.
- Safety-language violation rate.

### Product KPIs

- Activation after onboarding.
- Free-to-premium conversion.
- Trial-to-paid conversion.
- Trial cancellation success.
- Refund and billing-contact rate.
- Subscription-management link success.
- Seven-, 30-, and 90-day retention.
- Cross-platform continuation.
- Saved-alert engagement.
- Research-session completion.
- Search zero-result rate.
- Crash-free sessions.

The Discover and Evaluate issues reported in PropGPT reviews suggest that zero-result and failed-action rates should be first-class operational metrics.

### Responsible-use KPIs

- Time spent in unusually long sessions.
- Frequency of late-night or rapid repeated interactions, where legally and ethically appropriate to monitor.
- Cooling-off control usage.
- Notification opt-out rate.
- Suppression of urgency-oriented messages.
- Self-exclusion and account-closure completion.
- Responsible-resource engagement.
- Complaints concerning pressure, certainty, or misleading claims.

These signals must not be used to intensify engagement.

### Priority experiments

1. **Grade only versus grade plus evidence:** Measure comprehension and overreliance.
2. **Best price versus consensus-first card:** Measure whether users understand book and price dependence.
3. **Visible freshness badge:** Measure stale-selection avoidance.
4. **Evidence for and against:** Measure trust and informed dismissal.
5. **Free-tier daily limit versus feature limit:** Measure retention without creating manipulative urgency.
6. **Trial reminder wording:** Measure billing complaints and trust.
7. **NCAA league navigation:** Test sport-first, conference-first, and game-first organization.
8. **Parlay edit controls:** Measure correction of duplicate or conflicting legs.
9. **Abstention explanations:** Measure whether users accept “insufficient evidence” outcomes.
10. **Template versus policy-approved LLM explanation:** Compare factuality, latency, cost, and user comprehension.

Experiments should never optimize for higher wager frequency, larger stakes, or loss recovery.

## Responsible Gambling, Compliance, and Trust Requirements

### Product framing

The product must consistently state that:

- It is an educational and informational research tool.
- Sports outcomes are uncertain.
- Historical results do not guarantee future results.
- Grades and model outputs can be wrong.
- Odds and availability change.
- Users should verify information directly.
- The product does not provide financial advice.
- The product does not accept wagers unless a future, separately reviewed business model explicitly does so.

### Age and jurisdiction controls

PropGPT’s Apple listing is rated 18+ for simulated gambling. The new product should implement age gating and jurisdiction-aware disclosures based on legal advice. Do not infer that an 18+ store rating alone satisfies local law.

### Notification safety

- No “lock,” countdown-pressure, or loss-recovery messages.
- No push notification based on a user’s recent losses.
- Quiet hours by default.
- Frequency caps.
- Easy per-category opt-out.
- Clear source and timestamp in material alerts.
- Trial and renewal notifications separated from betting content.

### User controls

- Session reminders.
- Notification pause.
- Cooling-off mode.
- Account closure.
- Data export and deletion.
- Optional hiding of grades while retaining raw research.
- Optional blocking of parlay-related content.
- Links to approved responsible-gambling resources.

### Monetization safeguards

- No dark patterns around trials.
- Renewal cadence and total charge shown clearly.
- Easy platform cancellation.
- No claims that a subscription will “pay for itself.”
- No loss-chasing discounts.
- No pricing personalized from betting or loss behavior.
- No affiliate arrangement that distorts grades or book rankings without conspicuous disclosure.

### Privacy and security

If sportsbook synchronization is added, follow the strongest demonstrated market pattern: read-only access, local or strongly protected credential storage, granular privacy controls, and no ability to place bets or withdraw funds. Pikkit states that it uses read-only access, end-to-end encryption, system keychains, and does not sell user data. Those are useful benchmark claims, but the new product must independently design and audit its implementation.

### AI safety and policy

- Obtain written model-provider authorization.
- Maintain a non-LLM fallback.
- Restrict tools to read-only research.
- Validate every structured output.
- Block wager placement and account actions.
- Log model, prompt, tool calls, and evidence IDs.
- Re-evaluate policy after material product changes.
- Suspend the assistant if policy status becomes uncertain.

## Final Recommendations

1. **Proceed with a constrained pregame research MVP, not a full live-betting or execution platform.**
2. **Make line-specific cross-book comparison the core object of the product.**
3. **Use deterministic, sport-specific models for probabilities and grades.**
4. **Use an LLM only for evidence-bound explanation and auditing—and only after written provider approval.**
5. **Adopt The Odds API plus a validated statistics and injury source for initial development; evaluate BALLDONTLIE and CollegeFootballData through parallel coverage tests.**
6. **Keep a provider-neutral normalization layer and immutable odds history from the first release.**
7. **Publish a forecast ledger with exact timestamps, lines, prices, model versions, and later outcomes.**
8. **Treat direct matchup depth, editable parlays, and NCAA breadth as review-derived market opportunities, not proven universal PropGPT omissions.**
9. **Offer a meaningful free tier and sell premium workflow, freshness, coverage, and customization—not winning claims.**
10. **Make cancellation clarity, freshness suppression, provenance, and responsible-use controls launch-blocking acceptance criteria.**
11. **Defer automatic sportsbook syncing until contractual, privacy, and security requirements have been resolved.**
12. **Defer live markets until an enterprise feed supplies adequate latency, status handling, rights, and service commitments.**

PropGPT demonstrates that consumers value rapid, plain-English sports analysis. The stronger long-term product opportunity is to preserve that simplicity while making the underlying evidence inspectable, the market price comparable, the grade calibrated, the parlay editable, the NCAA experience complete enough to be useful, and the entire decision trail auditable.

---

## Sources

1. <https://apps.apple.com/us/app/propgpt-ai-props-analysis/id6645884227>
2. <https://apps.apple.com/us/app/propgpt-ai-sports-picks/id6645884227>
3. <https://mwm.ai/apps/propgpt-ai-props-analysis/6645884227>
4. <https://play.google.com/store/apps/details?id=net.orangutech.bestbet&hl=en>
5. <https://play.google.com/store/apps/details?id=net.orangutech.bestbet&hl=en_US>
6. <https://apps.apple.com/us/app/propgpt-ai-props-analysis/id6645884227?see-all=reviews&platform=undefined>
7. <https://apps.apple.com/us/app/propgpt-ai-props-analysis/id6645884227?see-all=reviews&platform=iphone>
8. <https://the-odds-api.com/>
9. <https://the-odds-api.com/liveapi/guides/v4/>
10. <https://www.balldontlie.io/>
11. <https://www.balldontlie.io/docs>
12. <https://www.balldontlie.io/terms.html>
13. <https://collegefootballdata.com/>
14. <https://openai.com/policies/commerce-policies/>
15. <https://openai.com/policies/usage-policies/>
16. <https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency>
17. <https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview>
18. <https://docs.anthropic.com/en/docs/build-with-claude/overview>
19. <https://apps.apple.com/tz/app/propgpt-ai-props-analysis/id6645884227>
20. <https://www.linkedin.com/posts/eyal-cohen30_propgpt-ai-props-analysis-activity-7349088304404799488-yaYw>
21. <https://www.linkedin.com/company/propgpt-ai-props-analysis>
22. <https://spark.mwm.ai/us/apps/propgpt-ai-props-analysis/6645884227>
23. <https://toolindex.net/tools/propgpt>
24. <https://propsbot.ai/propgpt-alternative/>
25. <https://apps.apple.com/lc/app/propgpt-ai-props-analysis/id6645884227>
26. <https://apps.apple.com/in/app/propgpt-ai-props-analysis/id6645884227>
27. <https://www.bettingpros.com/articles/bettingpros-launches-market-based-ev-tool/>
28. <https://bettingpros.com/nba/props/marcus-smart>
29. <https://support.bettingpros.com/hc/en-us>
30. <https://www.bettingpros.com/bet-tracker/>
31. <https://www.betsmart.co/tool-reviews/betting-pros>
32. <https://www.bettingpros.com/premium/>
33. <https://pikkit.com/pro>
34. <https://pikkit.com/blog/same-game-parlay>
35. <https://pikkit.com/>
36. <https://pikkit.com/bet-tracker>
37. <https://pikkit.com/booksync>
38. <https://pikkit.com/resources/sportsbooks>
39. <https://www.betstamp.com/tracking>
40. <https://www.betstamp.com/pro>
41. <https://www.betstamp.com/education/what-is-betstamp-guide-to-smarter-betting>
42. <https://try.betstamp.app/march-madness/>
43. <https://www.betstamp.com/>
44. <https://sharp.app/prizepicks/how-to-use-the-proptimizer-tool-for-prizepicks>
45. <https://sharp.app/top-props>
46. <https://sharp.app/intro-to-sharp-tools/how-to-use-bet-tracking>
47. <https://oddsjam.com/>
48. <https://oddsjam.com/betting-tools>
49. <https://oddsjam.com/betting-tools/arbitrage>
50. <https://dev.oddsjam.com/payment-tracker>
51. <https://www.betsmart.co/tool-reviews/oddsjam>
52. <https://picksandparlays.net/reviews/ai-picks/oddsjam>
53. <https://xclsvmedia.com/sharp-app-review-2026-oddsjam-alternative-ev-bettors/>
54. <https://oddsjam.com/betting-tools/sharp-money>
55. <https://oddspapi.io/blog/odds-api-pricing-2026-comparison/>
56. <https://github.com/pseudo-r/Public-ESPN-API>
57. <https://www.mysportsfeeds.com/feed-pricing/>
58. <https://www.mysportsfeeds.com/>
59. <https://www.mysportsfeeds.com/data-feeds>
60. <https://www.mysportsfeeds.com/faq/>
61. <https://github.com/MySportsFeeds>
62. <https://sportsdata.io/developers>
63. <https://apis.io/plans/sportsdataio/sportsdataio-plans-pricing/>
64. <https://sportsdata.io/apis>
65. <https://www.tank01.com/>
66. <https://rapidapi.com/tank01/api/tank01-nfl-live-in-game-real-time-statistics-nfl>
67. <https://rapidapi.com/tank01/api/tank01-fantasy-stats>
68. <https://sportsgameodds.com/>
69. <https://developer.opticodds.com/docs/odds-api-getting-started-guide>
70. <https://developer.sportradar.com/odds/reference/oc-player-props-overview>
71. <https://sportsapi.com/api-directory/the-odds-api/>
72. <https://odds-api.io/>
73. <https://sportsapi.com/api-directory/balldontlie/>
74. <https://bigballsdata.com/>
75. <https://sportsbookapi.com/>
76. <https://sportsdata.io/help/refresh-rates-feeds-and-timing>
77. <https://arxiv.org/html/2412.20309v1>
78. <https://arxiv.org/html/2411.08891v2>
79. <https://arxiv.org/html/2605.27752v2>
80. <https://arxiv.org/pdf/2506.00072>
81. <https://platform.openai.com/docs/guides/structured-outputs>
82. <https://platform.openai.com/docs/guides/function-calling>
83. <https://platform.openai.com/docs/guides/function-calling?amp=&amp=>
84. <https://docs.anthropic.com/ja/docs/build-with-claude/tool-use/implement-tool-use>
85. <https://docs.anthropic.com/en/api/openai-sdk>
86. <https://platform.openai.com/docs/api-reference/assistants/createAssistant?locale=en>
87. <https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use>
88. <https://arxiv.org/html/2504.14891v1>
89. <https://arxiv.org/abs/2606.23915>
90. <https://arxiv.org/html/2509.03787v1>
91. <https://arxiv.org/html/2503.02863v1>
92. <https://arxiv.org/html/2511.00280v1>
93. <https://arxiv.org/html/2507.17383>
94. <https://arxiv.org/html/2403.05973v1>
95. <https://arxiv.org/html/2508.06225v2>
96. <https://arxiv.org/abs/2608.12970>
97. <https://arxiv.org/html/2601.22025v1>
