import { useState } from "react";
import "./App.css";

const STEPS = ["consent", "spending", "financial", "loading", "result"];

const CARD_IMAGES = {
  "Freecharge Plus Credit Card": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
  "Axis ACE Credit Card": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
  "Axis Vistara Infinite Credit Card": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
  "Axis MY Zone Credit Card": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
  "Axis Fuel Credit Card": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
};

const CARD_COLORS = {
  "Freecharge Plus Credit Card": "#6C63FF",
  "Axis ACE Credit Card": "#E63946",
  "Axis Vistara Infinite Credit Card": "#1D3557",
  "Axis MY Zone Credit Card": "#2A9D8F",
  "Axis Fuel Credit Card": "#E76F51",
};

export default function App() {
  const [step, setStep] = useState("consent");
  const [form, setForm] = useState({
    spending_category: "",
    monthly_spend: 25000,
    travel_freq: "",
    income: "",
    existing_cards: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async () => {
    setStep("loading");
    setError("");
    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }
      const data = await res.json();
      setResult(data);
      setStep("result");
    } catch (e) {
      setError(e.message);
      setStep("financial");
    }
  };

  const reset = () => {
    setStep("consent");
    setForm({ spending_category: "", monthly_spend: 25000, travel_freq: "", income: "", existing_cards: "" });
    setResult(null);
    setError("");
  };

  return (
    <div className="app">
      <header className="header">
        <span className="logo">💳 FreechargeBiz</span>
        <span className="tagline">AI Card Advisor</span>
      </header>

      <main className="main">
        {step === "consent" && <ConsentScreen onAccept={() => setStep("spending")} />}
        {step === "spending" && <SpendingScreen form={form} update={update} onNext={() => setStep("financial")} />}
        {step === "financial" && <FinancialScreen form={form} update={update} onNext={submit} onBack={() => setStep("spending")} error={error} />}
        {step === "loading" && <LoadingScreen />}
        {step === "result" && result && <ResultScreen result={result} onReset={reset} />}
      </main>
    </div>
  );
}

function ConsentScreen({ onAccept }) {
  return (
    <div className="screen">
      <div className="consent-icon">🔒</div>
      <h1>Find Your Perfect Credit Card</h1>
      <p className="subtitle">Answer 5 quick questions. Our AI matches you to the best Axis Bank or Freecharge card for your lifestyle.</p>
      <div className="consent-box">
        <h3>What we collect & why</h3>
        <ul>
          <li>📊 Spending category — to match reward type</li>
          <li>💰 Monthly spend estimate — to check if premium cards are worth it</li>
          <li>✈️ Travel habits — to flag travel card eligibility</li>
          <li>💼 Income range — to filter eligible cards</li>
          <li>💳 Existing cards — to avoid duplicates</li>
        </ul>
        <p className="consent-note">No personal data is stored. This session is anonymous.</p>
      </div>
      <button className="btn-primary" onClick={onAccept}>I Agree — Find My Card →</button>
    </div>
  );
}

function SpendingScreen({ form, update, onNext }) {
  const categories = [
    { id: "Food & Dining", icon: "🍔" },
    { id: "Travel", icon: "✈️" },
    { id: "Fuel", icon: "⛽" },
    { id: "Shopping", icon: "🛍️" },
    { id: "All / Mixed", icon: "🌐" },
  ];
  const travels = ["Never", "Occasionally (1–2x/year)", "Frequently (monthly+)"];
  const canProceed = form.spending_category && form.travel_freq;

  return (
    <div className="screen">
      <ProgressBar step={1} />
      <h2>Your Spending Profile</h2>

      <label className="qlabel">What do you spend most on?</label>
      <div className="tile-grid">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`tile ${form.spending_category === c.id ? "tile-active" : ""}`}
            onClick={() => update("spending_category", c.id)}
          >
            <span className="tile-icon">{c.icon}</span>
            <span>{c.id}</span>
          </button>
        ))}
      </div>

      <label className="qlabel">Estimated monthly spend: <strong>₹{form.monthly_spend.toLocaleString("en-IN")}</strong></label>
      <input
        type="range" min={5000} max={200000} step={5000}
        value={form.monthly_spend}
        onChange={(e) => update("monthly_spend", Number(e.target.value))}
        className="slider"
      />
      <div className="slider-labels"><span>₹5,000</span><span>₹2,00,000+</span></div>

      <label className="qlabel">How often do you travel by flight?</label>
      <div className="radio-group">
        {travels.map((t) => (
          <label key={t} className={`radio-option ${form.travel_freq === t ? "radio-active" : ""}`}>
            <input type="radio" name="travel" value={t} checked={form.travel_freq === t} onChange={() => update("travel_freq", t)} />
            {t}
          </label>
        ))}
      </div>

      <button className="btn-primary" onClick={onNext} disabled={!canProceed}>Next →</button>
    </div>
  );
}

function FinancialScreen({ form, update, onNext, onBack, error }) {
  const incomes = ["Under ₹20,000", "₹20,000 – ₹40,000", "₹40,000 – ₹75,000", "₹75,000+"];
  const cards = ["None — first card", "1–2 cards", "3+ cards"];
  const canProceed = form.income && form.existing_cards;

  return (
    <div className="screen">
      <ProgressBar step={2} />
      <h2>Your Financial Profile</h2>

      <label className="qlabel">Monthly income range?</label>
      <div className="radio-group">
        {incomes.map((i) => (
          <label key={i} className={`radio-option ${form.income === i ? "radio-active" : ""}`}>
            <input type="radio" name="income" value={i} checked={form.income === i} onChange={() => update("income", i)} />
            {i}
          </label>
        ))}
      </div>

      <label className="qlabel">How many credit cards do you currently have?</label>
      <div className="radio-group">
        {cards.map((c) => (
          <label key={c} className={`radio-option ${form.existing_cards === c ? "radio-active" : ""}`}>
            <input type="radio" name="cards" value={c} checked={form.existing_cards === c} onChange={() => update("existing_cards", c)} />
            {c}
          </label>
        ))}
      </div>

      {error && <div className="error-box">⚠️ {error}</div>}

      <div className="btn-row">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} disabled={!canProceed}>Get My Recommendation →</button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="screen screen-center">
      <div className="spinner"></div>
      <h2>Analyzing your financial footprint...</h2>
      <p>Our AI is matching you to the best card</p>
    </div>
  );
}

function ResultScreen({ result, onReset }) {
  const primaryColor = CARD_COLORS[result.primary_card] || "#6C63FF";
  const secondaryColor = CARD_COLORS[result.secondary_card] || "#888";

  return (
    <div className="screen">
      <div className="result-header">
        <span className="result-badge">✅ Your Match is Ready</span>
        <h2>Here's your perfect card</h2>
      </div>

      {/* Primary Card */}
      <div className="card-recommendation" style={{ borderColor: primaryColor }}>
        <div className="card-visual" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)` }}>
          <div className="card-chip">▪▪▪▪</div>
          <div className="card-name">{result.primary_card}</div>
          <div className="card-number">•••• •••• •••• 0000</div>
        </div>

        <div className="match-score-row">
          <span className="match-label">Match Score</span>
          <span className="match-score" style={{ color: primaryColor }}>
            {Math.round(result.primary_match_score * 100)}%
          </span>
        </div>
        <div className="match-bar-bg">
          <div className="match-bar-fill" style={{ width: `${result.primary_match_score * 100}%`, background: primaryColor }} />
        </div>

        <div className="why-section">
          <h4>Why this fits you</h4>
          <ul>
            {result.primary_reasons.map((r, i) => (
              <li key={i}>✓ {r}</li>
            ))}
          </ul>
        </div>

        <a href={result.primary_card_url} target="_blank" rel="noreferrer">
          <button className="btn-primary" style={{ background: primaryColor }}>Apply Now →</button>
        </a>
      </div>

      {/* Secondary Card */}
      <div className="secondary-card">
        <p className="secondary-label">Also consider</p>
        <div className="secondary-inner" style={{ borderColor: secondaryColor }}>
          <div className="secondary-left">
            <div className="secondary-dot" style={{ background: secondaryColor }}></div>
            <span>{result.secondary_card}</span>
          </div>
          <div className="secondary-right">
            <span className="secondary-score" style={{ color: secondaryColor }}>
              {Math.round(result.secondary_match_score * 100)}% match
            </span>
            <a href={result.secondary_card_url} target="_blank" rel="noreferrer">
              <button className="btn-outline" style={{ borderColor: secondaryColor, color: secondaryColor }}>Apply</button>
            </a>
          </div>
        </div>
      </div>

      <button className="btn-ghost" onClick={onReset}>↺ Start Over</button>
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div className="progress-bar">
      <div className={`progress-step ${step >= 1 ? "active" : ""}`}>1 Spending</div>
      <div className="progress-line" />
      <div className={`progress-step ${step >= 2 ? "active" : ""}`}>2 Financial</div>
    </div>
  );
}
