# Product Requirement Document (PRD)
## AI-Powered Credit Card Recommendation Engine
**Product**: FreechargeBiz × Axis Bank Credit Card Recommender
**Version**: 1.0
**Date**: May 2025

---

## 1. Problem Statement

### The Broken Journey Today
Credit card discovery in India is fundamentally broken:

- **Information overload**: 50+ card options with overlapping benefits confuse users
- **Rigid forms**: Traditional eligibility forms ask 20+ fields upfront — users drop off
- **Generic recommendations**: Most platforms recommend the same 2–3 cards to everyone regardless of lifestyle
- **No reasoning**: Users are told "you qualify" but never told "this card fits YOU because..."
- **Trust gap**: Users don't understand why a card is recommended, so they don't apply

### The Opportunity
FreechargeBiz sits at the intersection of payments, lending, and financial data. Users already transact on Freecharge — their spending patterns, bill payment behavior, and recharge history are a goldmine for personalization. An AI engine that converts this footprint into a confident, reasoned card recommendation can dramatically increase application conversion rates.

**Target improvement**: Drop-off rate from 70% → under 30%. Conversion rate from 8% → 20%+.

---

## 2. User Personas

### Persona 1 — Rahul, The Salaried Professional
- **Age**: 28 | **Income**: ₹60,000/month | **City**: Bengaluru
- **Behavior**: Spends heavily on food delivery, OTT subscriptions, and weekend dining
- **Pain point**: Has a basic debit card, knows he should get a credit card but finds the process overwhelming
- **Goal**: A card that gives him cashback on everyday spends without an annual fee
- **Quote**: *"Just tell me which card saves me the most money on Swiggy and Netflix."*

### Persona 2 — Priya, The Frequent Flyer
- **Age**: 34 | **Income**: ₹1.5L/month | **City**: Mumbai
- **Behavior**: Flies 2–3 times/month for work, books hotels, uses airport lounges
- **Pain point**: Has 3 cards but none optimized for travel — misses lounge access and air miles
- **Goal**: A premium travel card with lounge access and air mile rewards
- **Quote**: *"I spend ₹40,000/month on travel. I should be earning miles, not nothing."*

### Persona 3 — Amit, The Daily Commuter
- **Age**: 32 | **Income**: ₹45,000/month | **City**: Delhi
- **Behavior**: Spends ₹8,000–10,000/month on fuel, uses car daily for work
- **Pain point**: Pays full price at fuel pumps, unaware of fuel surcharge waiver cards
- **Goal**: A card that saves him money specifically on fuel
- **Quote**: *"I fill up 3 times a week. There has to be a card for this."*

### Persona 4 — Sneha, The First-Time Credit User
- **Age**: 23 | **Income**: ₹25,000/month | **City**: Pune
- **Behavior**: Just started her first job, no credit history, cautious about debt
- **Pain point**: Doesn't know if she'll be approved, scared of hidden charges
- **Goal**: A simple entry-level card with no annual fee and easy approval
- **Quote**: *"I just want to start building my credit score without getting into trouble."*

---

## 3. Core Features

| Feature | Description |
|---|---|
| Conversational Onboarding | 4-step smart form — no 20-field walls |
| AI Recommendation Engine | LLM-powered matching with explicit reasoning |
| Bilingual Support | English + Hindi UI |
| Confidence Score | Shows how well the card matches the user |
| "Why This Card" Explanation | Personalized reasoning, not generic copy |
| Apply CTA | Deep link to Axis Bank / Freecharge application |
| Consent-First Design | Explicit data consent before any collection |
| Out-of-Scope Handling | Graceful fallback if inputs are insufficient |

---

## 4. End-to-End User Journey

```
[Landing Page]
    ↓
"Find your perfect card in 2 minutes" CTA
    ↓
[Step 1 — Consent Screen]
What data we use + why | Accept / Decline
    ↓
[Step 2 — Spending Profile] (3 questions)
  Q1: What do you spend most on? (Food / Travel / Fuel / Shopping / All)
  Q2: Monthly credit card spend estimate? (slider: ₹5K–₹2L+)
  Q3: Do you travel by flight? (Never / Occasionally / Frequently)
    ↓
[Step 3 — Financial Profile] (2 questions)
  Q4: Monthly income range? (₹20K / ₹40K / ₹75K / ₹1L+)
  Q5: Existing credit cards? (None / 1–2 / 3+)
    ↓
[AI Processing Screen]
"Analyzing your financial footprint..." (1–2 second animation)
    ↓
[Recommendation Page]
  - Recommended card (name, image, key benefits)
  - Match score (e.g., 92% match)
  - "Why this fits you" — 3 personalized bullet points
  - Secondary card option
  - Apply Now CTA → Axis Bank / Freecharge application
```

---

## 5. Technical Architecture

```
User Browser (React)
    ↓  POST /recommend  { spending_category, monthly_spend, travel_freq, income, existing_cards }
FastAPI Backend
    ↓
Recommendation Engine (recommender.py)
    ├── Builds system prompt with card catalog + user profile
    ├── Calls Llama 3.3 70B via Groq API (temperature=0.1)
    ├── Parses JSON response
    └── Pydantic validation → explicit error if schema fails
    ↓
CardRecommendation (validated Pydantic model)
    ↓
JSON response → React frontend
    ↓
Recommendation UI (card + match score + reasoning + CTA)
```

### Data Inputs Used for Recommendation

| Input | Source | Why It Matters |
|---|---|---|
| Primary spend category | User-selected | Determines reward type (cashback vs miles vs fuel) |
| Monthly spend estimate | User-selected | Determines if premium card is worth the fee |
| Travel frequency | User-selected | Flags travel card eligibility |
| Income range | User-selected | Determines eligibility tier |
| Existing cards | User-selected | Avoids recommending what they already have |

### Card Catalog (MVP — 5 Cards)

| Card | Best For | Key Benefit |
|---|---|---|
| Freecharge Plus Credit Card | Everyday cashback | 1.5% cashback on all spends |
| Axis ACE Credit Card | Online spends | 5% cashback on bill payments, 4% on Swiggy/Zomato |
| Axis Vistara Infinite | Frequent flyers | Air miles + complimentary business class ticket |
| Axis MY Zone Credit Card | First-time users | No annual fee, easy approval |
| Axis Fuel Credit Card | Daily commuters | 1% fuel surcharge waiver, 4x rewards on fuel |

### AI Model
- **Model**: Llama 3.3 70B Versatile via Groq (free tier)
- **Temperature**: 0.1 (consistent structured JSON output)
- **Fallback**: If confidence < 0.6, recommend entry-level card + flag for human review

---

## 6. Success Metrics

| Metric | Target |
|---|---|
| Form completion rate | > 70% |
| Recommendation load time | < 3 seconds |
| Apply CTA click-through rate | > 25% |
| Recommendation accuracy (user satisfaction) | > 80% |
| Out-of-scope graceful handling | 100% |

---

## 7. Out of Scope (V1)

- SMS parsing / bureau report integration (V2)
- Real-time eligibility check via Axis Bank API
- User accounts / saved recommendations
- Fine-tuning on real transaction data
- Mobile app (web-first for MVP)
