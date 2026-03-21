import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Heart, User, Activity,
  Zap, CheckCircle, AlertCircle
} from "lucide-react";
import "../styles/HomePage.css";

// ── Step config ──────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info",       icon: <User size={16} /> },
  { id: 2, label: "Cardiovascular",   icon: <Heart size={16} /> },
  { id: 3, label: "Clinical Details", icon: <Activity size={16} /> },
  { id: 4, label: "Review",           icon: <CheckCircle size={16} /> },
];

const INITIAL = {
  age: "", sex: "",
  chestPainType: "", restingBP: "", cholesterol: "",
  fastingBS: "", restingECG: "", maxHR: "",
  exerciseAngina: "", oldpeak: "", stSlope: "",
};

export default function PredictForm() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});

  // ── helpers ────────────────────────────────────────────
  const set = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: "" }));
  };

const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.age || form.age < 1 || form.age > 120)
        e.age = "Enter a valid age (1–120)";
      if (!form.sex)
        e.sex = "Please select sex";
    }
    if (s === 2) {
      if (!form.chestPainType)
        e.chestPainType = "Select chest pain type";
      if (!form.restingBP || form.restingBP < 50 || form.restingBP > 300)
        e.restingBP = "Enter valid BP (50–300 mmHg)";
      if (!form.cholesterol || form.cholesterol < 100 || form.cholesterol > 700)
        e.cholesterol = "Enter valid cholesterol (100–700 mg/dL)";
      if (!form.fastingBS)
        e.fastingBS = "Select fasting blood sugar";
    }
    if (s === 3) {
      if (!form.restingECG)
        e.restingECG = "Select resting ECG result";
      if (!form.maxHR || form.maxHR < 40 || form.maxHR > 250)
        e.maxHR = "Enter valid max heart rate (40–250 bpm)";
      if (!form.exerciseAngina)
        e.exerciseAngina = "Select yes or no";
      if (form.oldpeak === "" || form.oldpeak < 0 || form.oldpeak > 10)
        e.oldpeak = "Enter ST depression (0–10)";
      if (!form.stSlope)
        e.stSlope = "Select ST slope";
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

  // ── review rows ────────────────────────────────────────
  const reviewSections = [
    {
      title: "Basic Info",
      rows: [
        { label: "Age", value: form.age + " years" },
        { label: "Sex", value: form.sex === "M" ? "Male" : "Female" },
      ],
    },
    {
      title: "Cardiovascular",
      rows: [
        { label: "Chest Pain Type", value: cpLabel(form.chestPainType) },
        { label: "Resting BP", value: form.restingBP + " mmHg" },
        { label: "Cholesterol", value: form.cholesterol + " mg/dL" },
        { label: "Fasting Blood Sugar > 120", value: form.fastingBS === "1" ? "Yes" : "No" },
      ],
    },
    {
      title: "Clinical Details",
      rows: [
        { label: "Resting ECG", value: ecgLabel(form.restingECG) },
        { label: "Max Heart Rate", value: form.maxHR + " bpm" },
        { label: "Exercise Angina", value: form.exerciseAngina === "Y" ? "Yes" : "No" },
        { label: "ST Depression", value: form.oldpeak },
        { label: "ST Slope", value: slopeLabel(form.stSlope) },
      ],
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      position: "relative",
      overflow: "hidden",
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
          <h1 style={{
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800,
            color: "#fff", marginBottom: "10px",
          }}>
            Patient Health Data
          </h1>
          <p style={{ color: "#7a8494", fontSize: "0.9rem" }}>
            Fill in the clinical details below to generate a risk prediction.
          </p>
        </div>

        {/* step bar */}
        <StepBar step={step} />

        {/* card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "22px",
          padding: "40px 44px",
          backdropFilter: "blur(12px)",
          marginBottom: "24px",
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
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
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
              boxShadow: "0 0 32px rgba(236,72,153,0.35)",
              transition: "all 200ms",
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

// ── Step Bar ───────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "36px" }}>
      {STEPS.map((s, i) => {
        const done    = step > s.id;
        const active  = step === s.id;
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.8rem",
                background: done
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : active
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.05)",
                border: done
                  ? "none"
                  : active
                    ? "2px solid #6366f1"
                    : "1px solid rgba(255,255,255,0.1)",
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
                background: step > s.id
                  ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                  : "rgba(255,255,255,0.07)",
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

      <Field label="Age" error={errors.age} hint="Years (1–120)">
        <NumInput
          value={form.age}
          onChange={v => set("age", v)}
          placeholder="e.g. 54"
          min={1} max={120}
          error={errors.age}
        />
      </Field>

      <Field label="Biological Sex" error={errors.sex}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
          {[{ val: "M", label: "Male", emoji: "♂" }, { val: "F", label: "Female", emoji: "♀" }].map(opt => (
            <ChoiceCard
              key={opt.val}
              selected={form.sex === opt.val}
              onClick={() => set("sex", opt.val)}
              error={errors.sex}
            >
              <span style={{ fontSize: "1.4rem" }}>{opt.emoji}</span>
              <span style={{ fontWeight: 600 }}>{opt.label}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.sex && <ErrMsg msg={errors.sex} />}
      </Field>
    </div>
  );
}

// ── Step 2: Cardiovascular ─────────────────────────────────
function Step2({ form, set, errors }) {
  const cpOptions = [
    { val: "ATA", label: "Atypical Angina",   desc: "Chest pain not typical of angina" },
    { val: "NAP", label: "Non-Anginal",        desc: "Pain unrelated to heart" },
    { val: "ASY", label: "Asymptomatic",       desc: "No chest pain" },
    { val: "TA",  label: "Typical Angina",     desc: "Classic heart-related chest pain" },
  ];

  return (
    <div>
      <StepHeading icon={<Heart size={18} />} title="Cardiovascular Indicators" color="#ec4899" />

      <Field label="Chest Pain Type" error={errors.chestPainType}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "8px" }}>
          {cpOptions.map(opt => (
            <ChoiceCard
              key={opt.val}
              selected={form.chestPainType === opt.val}
              onClick={() => set("chestPainType", opt.val)}
              error={errors.chestPainType}
            >
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{opt.label}</span>
              <span style={{ fontSize: "0.72rem", color: "#7a8494", lineHeight: 1.4 }}>{opt.desc}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.chestPainType && <ErrMsg msg={errors.chestPainType} />}
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Field label="Resting Blood Pressure" error={errors.restingBP} hint="mmHg (50–300)">
          <NumInput value={form.restingBP} onChange={v => set("restingBP", v)}
  placeholder="e.g. 120" min={50} max={300} error={errors.restingBP} />
        </Field>
        <Field label="Serum Cholesterol" error={errors.cholesterol} hint="mg/dL (100–700)">
          <NumInput value={form.cholesterol} onChange={v => set("cholesterol", v)}
  placeholder="e.g. 200" min={100} max={700} error={errors.cholesterol} />
        </Field>
      </div>

      <Field label="Fasting Blood Sugar > 120 mg/dL" error={errors.fastingBS}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
          {[{ val: "1", label: "Yes" }, { val: "0", label: "No" }].map(opt => (
            <ChoiceCard key={opt.val}
              selected={form.fastingBS === opt.val}
              onClick={() => set("fastingBS", opt.val)}
              error={errors.fastingBS}
            >
              <span style={{ fontWeight: 600 }}>{opt.label}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.fastingBS && <ErrMsg msg={errors.fastingBS} />}
      </Field>
    </div>
  );
}

// ── Step 3: Clinical Details ───────────────────────────────
function Step3({ form, set, errors }) {
  const ecgOptions = [
    { val: "Normal", label: "Normal" },
    { val: "ST",     label: "ST-T Abnormality" },
    { val: "LVH",    label: "Left Ventricular Hypertrophy" },
  ];
  const slopeOptions = [
    { val: "Up",   label: "Upsloping",   desc: "Better prognosis" },
    { val: "Flat", label: "Flat",         desc: "Moderate risk" },
    { val: "Down", label: "Downsloping", desc: "Higher risk" },
  ];

  return (
    <div>
      <StepHeading icon={<Activity size={18} />} title="Clinical Test Results" color="#8b5cf6" />

      <Field label="Resting ECG Result" error={errors.restingECG}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "8px" }}>
          {ecgOptions.map(opt => (
            <ChoiceCard key={opt.val}
              selected={form.restingECG === opt.val}
              onClick={() => set("restingECG", opt.val)}
              error={errors.restingECG}
            >
              <span style={{ fontWeight: 600, fontSize: "0.82rem", textAlign: "center" }}>{opt.label}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.restingECG && <ErrMsg msg={errors.restingECG} />}
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Field label="Max Heart Rate Achieved" error={errors.maxHR} hint="bpm (40–250)">
          <NumInput value={form.maxHR} onChange={v => set("maxHR", v)}
  placeholder="e.g. 150" min={40} max={250} error={errors.maxHR} />
        </Field>
        <Field label="ST Depression (Oldpeak)" error={errors.oldpeak} hint="0.0 – 10.0">
          <NumInput value={form.oldpeak} onChange={v => set("oldpeak", v)}
            placeholder="e.g. 1.5" min={0} max={10} step={0.1} error={errors.oldpeak} />
        </Field>
      </div>

      <Field label="Exercise-Induced Angina" error={errors.exerciseAngina}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
          {[{ val: "Y", label: "Yes" }, { val: "N", label: "No" }].map(opt => (
            <ChoiceCard key={opt.val}
              selected={form.exerciseAngina === opt.val}
              onClick={() => set("exerciseAngina", opt.val)}
              error={errors.exerciseAngina}
            >
              <span style={{ fontWeight: 600 }}>{opt.label}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.exerciseAngina && <ErrMsg msg={errors.exerciseAngina} />}
      </Field>

      <Field label="ST Slope" error={errors.stSlope}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "8px" }}>
          {slopeOptions.map(opt => (
            <ChoiceCard key={opt.val}
              selected={form.stSlope === opt.val}
              onClick={() => set("stSlope", opt.val)}
              error={errors.stSlope}
            >
              <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{opt.label}</span>
              <span style={{ fontSize: "0.7rem", color: "#7a8494" }}>{opt.desc}</span>
            </ChoiceCard>
          ))}
        </div>
        {errors.stSlope && <ErrMsg msg={errors.stSlope} />}
      </Field>
    </div>
  );
}

// ── Step 4: Review ─────────────────────────────────────────
function Step4({ sections }) {
  return (
    <div>
      <StepHeading icon={<CheckCircle size={18} />} title="Review Your Data" color="#10b981" />
      <p style={{ color: "#7a8494", fontSize: "0.875rem", marginBottom: "28px" }}>
        Please confirm all details before generating your prediction.
      </p>

      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: "24px" }}>
          <p style={{
            color: "#6366f1", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px",
          }}>
            {sec.title}
          </p>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px", overflow: "hidden",
          }}>
            {sec.rows.map((row, j) => (
              <div key={j} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "12px 20px",
                borderBottom: j < sec.rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <span style={{ color: "#7a8494", fontSize: "0.875rem" }}>{row.label}</span>
                <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{
        display: "flex", alignItems: "flex-start", gap: "10px",
        background: "rgba(236,72,153,0.08)",
        border: "1px solid rgba(236,72,153,0.2)",
        borderRadius: "12px", padding: "14px 18px", marginTop: "8px",
      }}>
        <AlertCircle size={16} color="#f472b6" style={{ flexShrink: 0, marginTop: "1px" }} />
        <p style={{ color: "#b0b9d4", fontSize: "0.82rem", lineHeight: 1.6 }}>
          This prediction is generated by a mock model for demonstration. Real ML model will be integrated in coming Iterations.
        </p>
      </div>
    </div>
  );
}

// ── Reusable Components ────────────────────────────────────
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

function Field({ label, error, hint, children }) {
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
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min} max={max} step={step}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "10px", padding: "11px 16px",
        color: "#fff", fontSize: "0.95rem", outline: "none",
        transition: "border-color 200ms",
      }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
    />
  );
}

function ChoiceCard({ selected, onClick, error, children }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: "4px",
        padding: "14px 10px", borderRadius: "12px", cursor: "pointer",
        textAlign: "center",
        background: selected ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
        border: selected
          ? "1.5px solid #6366f1"
          : error
            ? "1px solid rgba(239,68,68,0.4)"
            : "1px solid rgba(255,255,255,0.08)",
        color: selected ? "#a5b4fc" : "#b0b9d4",
        transition: "all 200ms",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    >
      {children}
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

// ── Label helpers ──────────────────────────────────────────
function cpLabel(v) {
  return { ATA: "Atypical Angina", NAP: "Non-Anginal", ASY: "Asymptomatic", TA: "Typical Angina" }[v] || v;
}
function ecgLabel(v) {
  return { Normal: "Normal", ST: "ST-T Abnormality", LVH: "Left Ventricular Hypertrophy" }[v] || v;
}
function slopeLabel(v) {
  return { Up: "Upsloping", Flat: "Flat", Down: "Downsloping" }[v] || v;
}