import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Heart, User, Activity,
  Zap, CheckCircle, AlertCircle
} from "lucide-react";
import "../styles/HomePage.css";

// ── Step config ──────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info",    icon: <User size={16} /> },
  { id: 2, label: "Lifestyle",     icon: <Heart size={16} /> },
  { id: 3, label: "Health History",icon: <Activity size={16} /> },
  { id: 4, label: "Review",        icon: <CheckCircle size={16} /> },
];

const AGE_OPTIONS = [
  '18-24','25-29','30-34','35-39','40-44','45-49',
  '50-54','55-59','60-64','65-69','70-74','75-79','80+'
];
const RACE_OPTIONS = [
  'White','Black','Asian','Hispanic',
  'American Indian/Alaskan Native','Other'
];
const GEN_HEALTH_OPTIONS = ['Excellent','Very good','Good','Fair','Poor'];

const INITIAL = {
  sex: '', ageCategory: '', race: '', bmi: '',
  smoking: '', alcoholDrinking: '', physicalActivity: '',
  sleepTime: '', genHealth: '',
  stroke: '', diabetic: '', physicalHealth: '',
  mentalHealth: '', diffWalking: '',
  asthma: '', kidneyDisease: '', skinCancer: '',
};

export default function PredictForm() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: "" }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.sex)         e.sex = "Please select sex";
      if (!form.ageCategory) e.ageCategory = "Please select age category";
      if (!form.race)        e.race = "Please select race";
      if (!form.bmi || form.bmi < 10 || form.bmi > 100)
        e.bmi = "Enter a valid BMI (10–100)";
    }
    if (s === 2) {
      if (!form.smoking)          e.smoking = "Please select an option";
      if (!form.alcoholDrinking)  e.alcoholDrinking = "Please select an option";
      if (!form.physicalActivity) e.physicalActivity = "Please select an option";
      if (!form.sleepTime || form.sleepTime < 1 || form.sleepTime > 24)
        e.sleepTime = "Enter valid sleep hours (1–24)";
      if (!form.genHealth) e.genHealth = "Please select general health";
    }
    if (s === 3) {
      if (!form.stroke)      e.stroke = "Please select an option";
      if (!form.diabetic)    e.diabetic = "Please select an option";
      if (form.physicalHealth === "" || form.physicalHealth < 0 || form.physicalHealth > 30)
        e.physicalHealth = "Enter valid days (0–30)";
      if (form.mentalHealth === "" || form.mentalHealth < 0 || form.mentalHealth > 30)
        e.mentalHealth = "Enter valid days (0–30)";
      if (!form.diffWalking)   e.diffWalking = "Please select an option";
      if (!form.asthma)        e.asthma = "Please select an option";
      if (!form.kidneyDisease) e.kidneyDisease = "Please select an option";
      if (!form.skinCancer)    e.skinCancer = "Please select an option";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => navigate("/result", { state: { formData: form } });

  // ── review rows ───────────────────────────────────────
  const reviewSections = [
    {
      title: "Basic Info",
      rows: [
        { label: "Sex", value: form.sex },
        { label: "Age Category", value: form.ageCategory },
        { label: "Race", value: form.race },
        { label: "BMI", value: form.bmi },
      ],
    },
    {
      title: "Lifestyle",
      rows: [
        { label: "Smoking", value: form.smoking },
        { label: "Heavy Alcohol Drinking", value: form.alcoholDrinking },
        { label: "Physical Activity", value: form.physicalActivity },
        { label: "Sleep Time", value: form.sleepTime + " hrs" },
        { label: "General Health", value: form.genHealth },
      ],
    },
    {
      title: "Health History",
      rows: [
        { label: "Stroke", value: form.stroke },
        { label: "Diabetic", value: form.diabetic },
        { label: "Physical Health (bad days)", value: form.physicalHealth + " days" },
        { label: "Mental Health (bad days)", value: form.mentalHealth + " days" },
        { label: "Difficulty Walking", value: form.diffWalking },
        { label: "Asthma", value: form.asthma },
        { label: "Kidney Disease", value: form.kidneyDisease },
        { label: "Skin Cancer", value: form.skinCancer },
      ],
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* bg */}
      <div className="hero-background" style={{ position: "fixed" }}>
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      {/* navbar */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(10,14,39,0.7)", backdropFilter: "blur(16px)",
      }}>
        <div className="logo"><div className="logo-icon">♦</div><span>MediRisk</span></div>
        <button onClick={() => navigate("/dashboard")} style={{
          background: "none", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px", padding: "7px 16px",
          color: "#7a8494", fontSize: "0.85rem", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px",
          transition: "all 200ms",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#7a8494"; }}
        >
          ← Dashboard
        </button>
      </nav>

      {/* body */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "700px", margin: "0 auto", padding: "48px 24px 80px",
      }}>
        {/* page heading */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.25)",
            borderRadius: "20px", padding: "5px 14px", marginBottom: "16px",
          }}>
            <Heart size={13} color="#f472b6" />
            <span style={{ color: "#f472b6", fontSize: "0.75rem", fontWeight: 700 }}>
              Heart Disease Risk Assessment
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
            Patient Health Data
          </h1>
          <p style={{ color: "#7a8494", fontSize: "0.9rem" }}>
            Fill in your health details below to generate an AI risk prediction.
          </p>
        </div>

        {/* step bar */}
        <StepBar step={step} />

        {/* card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "22px", padding: "40px 44px",
          backdropFilter: "blur(12px)", marginBottom: "24px",
        }}>
          {step === 1 && <Step1 form={form} set={set} errors={errors} />}
          {step === 2 && <Step2 form={form} set={set} errors={errors} />}
          {step === 3 && <Step3 form={form} set={set} errors={errors} />}
          {step === 4 && <Step4 sections={reviewSections} />}
        </div>

        {/* nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          {step > 1 ? (
            <button onClick={back} style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", padding: "12px 24px",
              color: "#b0b9d4", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
              transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={next} className="btn-primary-lg" style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "12px 32px",
            }}>
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={submit} style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
              border: "none", borderRadius: "12px", padding: "12px 32px",
              color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              boxShadow: "0 0 32px rgba(236,72,153,0.35)", transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 48px rgba(236,72,153,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(236,72,153,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Zap size={18} /> Predict Risk
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step Bar — unchanged from your original ────────────────
function StepBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "36px" }}>
      {STEPS.map((s, i) => {
        const done   = step > s.id;
        const active = step === s.id;
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.8rem",
                background: done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                border: done ? "none" : active ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
                color: done ? "#fff" : active ? "#a5b4fc" : "#4a5568",
                transition: "all 300ms",
              }}>
                {done ? "✓" : s.icon}
              </div>
              <span style={{
                fontSize: "0.7rem", fontWeight: 600,
                color: active ? "#a5b4fc" : done ? "#6366f1" : "#4a5568",
                whiteSpace: "nowrap",
              }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: "2px", margin: "0 6px", marginBottom: "22px",
                background: step > s.id ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.07)",
                borderRadius: "2px", transition: "all 300ms",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Step 1: Basic Info ─────────────────────────────────────
function Step1({ form, set, errors }) {
  return (
    <div>
      <StepHeading icon={<User size={18} />} title="Basic Information" color="#6366f1" />

      <Field label="Biological Sex" error={errors.sex}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
          {[{ val: "Male", label: "Male", emoji: "♂" }, { val: "Female", label: "Female", emoji: "♀" }].map(opt => (
            <ChoiceCard key={opt.val} selected={form.sex === opt.val} onClick={() => set("sex", opt.val)} error={errors.sex}>
              <span style={{ fontSize: "1.4rem" }}>{opt.emoji}</span>
              <span style={{ fontWeight: 600 }}>{opt.label}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.sex && <ErrMsg msg={errors.sex} />}
      </Field>

      <Field label="Age Category" error={errors.ageCategory}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "8px" }}>
          {AGE_OPTIONS.map(opt => (
            <ChoiceCard key={opt} selected={form.ageCategory === opt} onClick={() => set("ageCategory", opt)} error={errors.ageCategory}>
              <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>{opt}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.ageCategory && <ErrMsg msg={errors.ageCategory} />}
      </Field>

      <Field label="Race / Ethnicity" error={errors.race}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
          {RACE_OPTIONS.map(opt => (
            <ChoiceCard key={opt} selected={form.race === opt} onClick={() => set("race", opt)} error={errors.race}>
              <span style={{ fontWeight: 600, fontSize: "0.8rem", textAlign: "center" }}>{opt}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.race && <ErrMsg msg={errors.race} />}
      </Field>

      <Field label="BMI (Body Mass Index)" error={errors.bmi} hint="10–100">
        <NumInput value={form.bmi} onChange={v => set("bmi", v)} placeholder="e.g. 25.4" min={10} max={100} step={0.1} error={errors.bmi} />
      </Field>
    </div>
  );
}

// ── Step 2: Lifestyle ──────────────────────────────────────
function Step2({ form, set, errors }) {
  return (
    <div>
      <StepHeading icon={<Heart size={18} />} title="Lifestyle Factors" color="#ec4899" />

      <Field label="Do you smoke?" error={errors.smoking}>
        <YesNo k="smoking" form={form} set={set} error={errors.smoking} />
      </Field>

      <Field label="Heavy alcohol drinking?" error={errors.alcoholDrinking}>
        <YesNo k="alcoholDrinking" form={form} set={set} error={errors.alcoholDrinking} />
      </Field>

      <Field label="Physical activity in past 30 days?" error={errors.physicalActivity}>
        <YesNo k="physicalActivity" form={form} set={set} error={errors.physicalActivity} />
      </Field>

      <Field label="Average sleep time (hours/night)" error={errors.sleepTime} hint="1–24 hrs">
        <NumInput value={form.sleepTime} onChange={v => set("sleepTime", v)} placeholder="e.g. 7" min={1} max={24} error={errors.sleepTime} />
      </Field>

      <Field label="General Health" error={errors.genHealth}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginTop: "8px" }}>
          {GEN_HEALTH_OPTIONS.map(opt => (
            <ChoiceCard key={opt} selected={form.genHealth === opt} onClick={() => set("genHealth", opt)} error={errors.genHealth}>
              <span style={{ fontWeight: 600, fontSize: "0.75rem", textAlign: "center" }}>{opt}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.genHealth && <ErrMsg msg={errors.genHealth} />}
      </Field>
    </div>
  );
}

// ── Step 3: Health History ─────────────────────────────────
function Step3({ form, set, errors }) {
  return (
    <div>
      <StepHeading icon={<Activity size={18} />} title="Health History" color="#8b5cf6" />

      <Field label="Ever had a stroke?" error={errors.stroke}>
        <YesNo k="stroke" form={form} set={set} error={errors.stroke} />
      </Field>

      <Field label="Diabetic?" error={errors.diabetic}>
        <YesNo k="diabetic" form={form} set={set} error={errors.diabetic} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Field label="Physical health (bad days/30)" error={errors.physicalHealth} hint="0–30 days">
          <NumInput value={form.physicalHealth} onChange={v => set("physicalHealth", v)} placeholder="e.g. 5" min={0} max={30} error={errors.physicalHealth} />
        </Field>
        <Field label="Mental health (bad days/30)" error={errors.mentalHealth} hint="0–30 days">
          <NumInput value={form.mentalHealth} onChange={v => set("mentalHealth", v)} placeholder="e.g. 3" min={0} max={30} error={errors.mentalHealth} />
        </Field>
      </div>

      <Field label="Difficulty walking or climbing stairs?" error={errors.diffWalking}>
        <YesNo k="diffWalking" form={form} set={set} error={errors.diffWalking} />
      </Field>

      <Field label="Do you have asthma?" error={errors.asthma}>
        <YesNo k="asthma" form={form} set={set} error={errors.asthma} />
      </Field>

      <Field label="Kidney disease?" error={errors.kidneyDisease}>
        <YesNo k="kidneyDisease" form={form} set={set} error={errors.kidneyDisease} />
      </Field>

      <Field label="Skin cancer?" error={errors.skinCancer}>
        <YesNo k="skinCancer" form={form} set={set} error={errors.skinCancer} />
      </Field>
    </div>
  );
}

// ── Step 4: Review — same structure as your original ───────
function Step4({ sections }) {
  return (
    <div>
      <StepHeading icon={<CheckCircle size={18} />} title="Review Your Data" color="#10b981" />
      <p style={{ color: "#7a8494", fontSize: "0.875rem", marginBottom: "28px" }}>
        Please confirm all details before generating your prediction.
      </p>
      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: "24px" }}>
          <p style={{ color: "#6366f1", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
            {sec.title}
          </p>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
            {sec.rows.map((row, j) => (
              <div key={j} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 20px",
                borderBottom: j < sec.rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <span style={{ color: "#7a8494", fontSize: "0.875rem" }}>{row.label}</span>
                <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Reusable Components — all identical to your original ───
function StepHeading({ icon, title, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "10px",
        background: color + "18", border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center", color,
      }}>
        {icon}
      </div>
      <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>{title}</h2>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <label style={{ color: "#b0b9d4", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.03em" }}>
          {label}
        </label>
        {hint && <span style={{ color: "#4a5568", fontSize: "0.75rem" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, placeholder, min, max, step = 1, error }) {
  return (
    <input
      type="number" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} min={min} max={max} step={step}
      style={{
        width: "100%", background: "rgba(255,255,255,0.06)",
        border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "10px", padding: "11px 16px",
        color: "#fff", fontSize: "0.95rem", outline: "none", transition: "border-color 200ms",
      }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
    />
  );
}

function ChoiceCard({ selected, onClick, error, children }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "4px",
      padding: "14px 10px", borderRadius: "12px", cursor: "pointer", textAlign: "center",
      background: selected ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
      border: selected ? "1.5px solid #6366f1" : error ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
      color: selected ? "#a5b4fc" : "#b0b9d4", transition: "all 200ms",
    }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    >
      {children}
    </div>
  );
}

function YesNo({ k, form, set, error }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
        {["Yes", "No"].map(v => (
          <ChoiceCard key={v} selected={form[k] === v} onClick={() => set(k, v)} error={error}>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </ChoiceCard>
        ))}
      </div>
      {error && <ErrMsg msg={error} />}
    </div>
  );
}

function ErrMsg({ msg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
      <AlertCircle size={13} color="#f87171" />
      <span style={{ color: "#f87171", fontSize: "0.78rem" }}>{msg}</span>
    </div>
  );
}