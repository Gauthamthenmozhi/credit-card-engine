import os
import json
from groq import Groq
from pydantic import BaseModel, ValidationError
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

CARD_CATALOG = """
1. Freecharge Plus Credit Card
   - Best for: Everyday cashback, all spends
   - Key benefits: 1.5% cashback on all spends, no annual fee, instant approval
   - Income required: ₹20,000+/month
   - Apply URL: https://www.freecharge.in/credit-card

2. Axis ACE Credit Card
   - Best for: Online shopping, food delivery, bill payments
   - Key benefits: 5% cashback on bill payments via Google Pay, 4% on Swiggy/Zomato/Ola, 2% on all else
   - Income required: ₹40,000+/month
   - Apply URL: https://www.axisbank.com/retail/cards/credit-card/ace-credit-card

3. Axis Vistara Infinite Credit Card
   - Best for: Frequent flyers, premium travel
   - Key benefits: Complimentary business class ticket, unlimited lounge access, air miles on every spend
   - Income required: ₹1,00,000+/month
   - Apply URL: https://www.axisbank.com/retail/cards/credit-card/vistara-infinite-credit-card

4. Axis MY Zone Credit Card
   - Best for: First-time credit users, students, beginners
   - Key benefits: No annual fee, easy approval, 10% off on Myntra, movie discounts
   - Income required: ₹20,000+/month
   - Apply URL: https://www.axisbank.com/retail/cards/credit-card/my-zone-credit-card

5. Axis Fuel Credit Card
   - Best for: Daily commuters, high fuel spends
   - Key benefits: 1% fuel surcharge waiver, 4x reward points on fuel, roadside assistance
   - Income required: ₹30,000+/month
   - Apply URL: https://www.axisbank.com/retail/cards/credit-card/indian-oil-axis-bank-credit-card
"""

SYSTEM_PROMPT = f"""You are an expert credit card advisor for FreechargeBiz and Axis Bank.
Given a user's financial profile, recommend the single best credit card from the catalog below.

CARD CATALOG:
{CARD_CATALOG}

RULES:
- Pick exactly ONE primary card and ONE secondary card from the catalog
- Match based on: spending category, monthly spend, travel frequency, income, existing cards
- If income is too low for a premium card, pick a lower-tier card
- If user already has 3+ cards, recommend the most differentiated option
- confidence must be between 0.0 and 1.0
- If profile is too vague or incomplete, recommend Axis MY Zone as default with confidence 0.5
- reasons must be exactly 3 bullet points personalized to the user's inputs — not generic copy
- language must be "en"

Respond ONLY with valid JSON in this exact schema:
{{
  "primary_card": "card name",
  "primary_card_url": "apply url",
  "primary_match_score": 0.92,
  "primary_reasons": ["reason 1", "reason 2", "reason 3"],
  "secondary_card": "card name",
  "secondary_card_url": "apply url",
  "secondary_match_score": 0.75,
  "confidence": 0.92,
  "language": "en"
}}"""


class CardRecommendation(BaseModel):
    primary_card: str
    primary_card_url: str
    primary_match_score: float
    primary_reasons: list[str]
    secondary_card: str
    secondary_card_url: str
    secondary_match_score: float
    confidence: float
    language: str


def get_recommendation(spending_category: str, monthly_spend: int, travel_freq: str, income: str, existing_cards: str) -> CardRecommendation:
    user_profile = f"""
User Profile:
- Primary spending category: {spending_category}
- Estimated monthly spend: ₹{monthly_spend:,}
- Travel frequency: {travel_freq}
- Monthly income range: {income}
- Existing credit cards: {existing_cards}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_profile}
        ],
        temperature=0.1,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    data = json.loads(raw)
    return CardRecommendation(**data)
