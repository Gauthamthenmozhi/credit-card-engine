from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from recommender import get_recommendation
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecommendRequest(BaseModel):
    spending_category: str
    monthly_spend: int
    travel_freq: str
    income: str
    existing_cards: str


@app.post("/recommend")
def recommend(req: RecommendRequest):
    try:
        result = get_recommendation(
            req.spending_category,
            req.monthly_spend,
            req.travel_freq,
            req.income,
            req.existing_cards,
        )
        return result
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"AI returned malformed JSON: {e}")
    except ValidationError as e:
        raise HTTPException(status_code=502, detail=f"AI response schema invalid: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
