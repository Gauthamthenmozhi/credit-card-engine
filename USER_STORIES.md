# User Stories & Prioritization
## AI-Powered Credit Card Recommendation Engine
**Product**: FreechargeBiz × Axis Bank Credit Card Recommender
**Version**: 1.0
**Date**: May 2025

---

## User Stories

---

### US-01 — Consent Screen
**As a** new user,
**I want to** see clearly what data is being collected and why,
**So that** I can trust the platform before sharing any information.

**Acceptance Criteria:**
- [ ] Consent screen appears before any data collection
- [ ] Lists exactly what data is used (spending category, income range, travel habits)
- [ ] User must click "I Agree" to proceed — no implicit consent
- [ ] Declining consent shows a graceful exit message, not an error
- [ ] Consent is logged with a timestamp

---

### US-02 — Spending Profile Collection
**As a** user,
**I want to** answer 3 simple questions about my spending habits,
**So that** the engine understands my lifestyle without overwhelming me with a long form.

**Acceptance Criteria:**
- [ ] Exactly 3 questions on this screen — no more
- [ ] Q1: Primary spend category shown as clickable tiles (Food / Travel / Fuel / Shopping / All)
- [ ] Q2: Monthly spend shown as a slider (₹5,000 – ₹2,00,000+)
- [ ] Q3: Travel frequency shown as radio buttons (Never / Occasionally / Frequently)
- [ ] User cannot proceed without answering all 3
- [ ] Progress bar shows Step 1 of 2

---

### US-03 — Financial Profile Collection
**As a** user,
**I want to** provide my income range and existing card status,
**So that** the recommendation matches cards I am actually eligible for.

**Acceptance Criteria:**
- [ ] Exactly 2 questions on this screen
- [ ] Q4: Income range shown as 4 options (Under ₹20K / ₹20K–₹40K / ₹40K–₹75K / ₹75K+)
- [ ] Q5: Existing cards shown as 3 options (None / 1–2 cards / 3+ cards)
- [ ] User cannot proceed without answering both
- [ ] Progress bar shows Step 2 of 2
- [ ] Back button returns to spending profile with answers preserved

---

### US-04 — AI Processing Screen
**As a** user,
**I want to** see a loading animation while my profile is being analyzed,
**So that** I understand the system is working and don't abandon the flow.

**Acceptance Criteria:**
- [ ] Loading screen appears immediately after form submission
- [ ] Shows animated progress indicator with message "Analyzing your financial footprint..."
- [ ] Loads recommendation within 3 seconds
- [ ] If API call fails, shows a friendly error with a "Try Again" button — not a blank screen

---

### US-05 — Card Recommendation Display
**As a** user,
**I want to** see a personalized card recommendation with a clear explanation of why it fits me,
**So that** I feel confident enough to apply.

**Acceptance Criteria:**
- [ ] Recommended card name, image, and top 3 benefits are displayed
- [ ] Match score (e.g., "92% match") is shown prominently
- [ ] "Why this fits you" section shows 3 personalized bullet points based on user inputs
- [ ] A secondary card option is shown below the primary recommendation
- [ ] "Apply Now" CTA button is visible above the fold
- [ ] Clicking "Apply Now" opens the Axis Bank / Freecharge application page

---

### US-06 — Apply CTA
**As a** user who has seen my recommendation,
**I want to** apply for the card in one click,
**So that** I don't have to search for the application page myself.

**Acceptance Criteria:**
- [ ] "Apply Now" button is present on the recommendation page
- [ ] Button links directly to the correct card's application URL
- [ ] Link opens in a new tab
- [ ] Button is styled prominently (not hidden or below the fold)

---

### US-07 — Out-of-Scope Handling
**As a** user who submits incomplete or nonsensical inputs,
**I want to** receive a helpful fallback response,
**So that** I am not shown a wrong recommendation or a broken screen.

**Acceptance Criteria:**
- [ ] If AI confidence < 0.6, recommend the entry-level Axis MY Zone card as a safe default
- [ ] Show a message: "Based on limited information, here's our best match for you"
- [ ] Never show a blank recommendation page
- [ ] Never force an incorrect card recommendation

---

### US-08 — Retake the Quiz
**As a** user who wants to explore a different card,
**I want to** retake the questionnaire with different answers,
**So that** I can see how the recommendation changes.

**Acceptance Criteria:**
- [ ] "Start Over" button is visible on the recommendation page
- [ ] Clicking it resets all answers and returns to Step 1
- [ ] Previous answers are cleared — not pre-filled

---

### US-09 — Mobile Responsive UI
**As a** user on a mobile device,
**I want to** complete the form and see the recommendation on my phone,
**So that** I don't need a desktop to use the product.

**Acceptance Criteria:**
- [ ] All screens render correctly on screen widths 375px and above
- [ ] Slider, tiles, and buttons are touch-friendly (min 44px tap targets)
- [ ] No horizontal scrolling on any screen

---

### US-10 — Hindi Language Support
**As a** Hindi-speaking user,
**I want to** use the product in Hindi,
**So that** I can understand the recommendation without language barriers.

**Acceptance Criteria:**
- [ ] Language toggle (EN / HI) is visible on the landing page
- [ ] All UI labels, questions, and recommendation text switch to Hindi
- [ ] AI reasoning is generated in Hindi when Hindi is selected

---

## Prioritization — MoSCoW Framework

### Must Have (MVP — Ship First)

| ID | Story | Reason |
|---|---|---|
| US-01 | Consent Screen | Legal requirement, trust foundation |
| US-02 | Spending Profile Collection | Core data input for recommendation |
| US-03 | Financial Profile Collection | Eligibility filtering |
| US-04 | AI Processing Screen | UX — prevents abandonment during load |
| US-05 | Card Recommendation Display | Core product output |
| US-06 | Apply CTA | Conversion — the entire point of the product |
| US-07 | Out-of-Scope Handling | Prevents broken/wrong recommendations |

### Should Have (V1.1 — Next Sprint)

| ID | Story | Reason |
|---|---|---|
| US-08 | Retake the Quiz | Increases engagement and exploration |
| US-09 | Mobile Responsive UI | 70%+ users are on mobile |

### Could Have (V2 — Backlog)

| ID | Story | Reason |
|---|---|---|
| US-10 | Hindi Language Support | Expands reach but not critical for pilot |

### Won't Have (Out of Scope for Now)

| Feature | Reason |
|---|---|
| SMS data parsing | Requires device permissions, complex integration |
| Bureau report integration | Requires CIBIL/Experian API partnership |
| User accounts & saved recommendations | Not needed for single-session prototype |
| Real-time eligibility check via Axis API | Requires bank API access |
| Fine-tuning on real transaction data | Needs labeled dataset |

---

## RICE Prioritization (Top 5 MVP Stories)

| Story | Reach (1–10) | Impact (1–10) | Confidence (%) | Effort (weeks) | RICE Score |
|---|---|---|---|---|---|
| US-05 Card Recommendation | 10 | 10 | 90% | 1 | 90 |
| US-02 Spending Profile | 10 | 9 | 95% | 0.5 | 171 |
| US-06 Apply CTA | 8 | 10 | 95% | 0.5 | 152 |
| US-03 Financial Profile | 10 | 8 | 95% | 0.5 | 152 |
| US-01 Consent Screen | 10 | 7 | 100% | 0.5 | 140 |

> RICE Score = (Reach × Impact × Confidence) / Effort

**Build order based on RICE**: US-02 → US-03 → US-06 → US-01 → US-05

---

## MVP Definition

The MVP ships when these 7 stories are complete and tested:
**US-01, US-02, US-03, US-04, US-05, US-06, US-07**

A user can:
1. Give consent
2. Answer 5 questions
3. See a personalized AI-powered card recommendation with reasoning
4. Click Apply Now

Everything else is post-MVP.
