import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Trash2 } from "lucide-react";
import { clearPredictionHistory, getPredictionHistory } from "../services/historyService";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getPredictionHistory()
      .then(data => {
        if (mounted) {
          setItems(data);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || "Failed to load history.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    if (!items.length) {
      return { total: 0, high: 0, moderate: 0, low: 0 };
    }
    return {
      total: items.length,
      high: items.filter(item => item.riskLevel === "High").length,
      moderate: items.filter(item => item.riskLevel === "Moderate").length,
      low: items.filter(item => item.riskLevel === "Low").length,
    };
  }, [items]);

  async function handleClear() {
    try {
      await clearPredictionHistory();
      setItems([]);
    } catch (err) {
      setError(err.message || "Failed to clear history.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", color: "#fff", padding: "36px 22px 70px" }}>
      <div style={{ maxWidth: "940px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <div>
            <p style={{ color: "#818cf8", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              Prediction History
            </p>
            <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Historical Assessments</h1>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/dashboard")} style={btnGhost}>Back to Dashboard</button>
            <button onClick={handleClear} style={btnDanger}><Trash2 size={14} /> Clear History</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
          <Stat label="Total" value={summary.total} color="#c4b5fd" />
          <Stat label="High" value={summary.high} color="#f87171" />
          <Stat label="Moderate" value={summary.moderate} color="#f59e0b" />
          <Stat label="Low" value={summary.low} color="#34d399" />
        </div>

        {loading && (
          <div style={panelStyle}>
            <p style={{ margin: 0, color: "#cbd5e1" }}>Loading prediction history...</p>
          </div>
        )}

        {!loading && error && (
          <div style={panelStyle}>
            <p style={{ margin: 0, color: "#fca5a5" }}>{error}</p>
          </div>
        )}

        {!loading && !error && !items.length && (
          <div style={panelStyle}>
            <p style={{ margin: 0, color: "#cbd5e1" }}>No predictions saved yet. Run a prediction to start building your history.</p>
          </div>
        )}

        {!loading && !error && items.map(item => (
          <div key={item.id} style={{ ...panelStyle, marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
              <p style={{ margin: 0, color: "#fff", fontWeight: 700 }}>
                {item.riskLevel} risk ({item.probability}%)
              </p>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.82rem" }}>{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <p style={{ margin: "0 0 6px", color: "#a5b4fc", fontSize: "0.85rem" }}>
              Factors: {(item.riskFactors || []).slice(0, 4).join(", ") || "No major factors detected"}
            </p>
            <details>
              <summary style={{ cursor: "pointer", color: "#cbd5e1", fontSize: "0.83rem" }}>Submitted data</summary>
              <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "8px" }}>
                {Object.entries(item.formData || {}).map(([key, value]) => (
                  <div key={key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px" }}>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{key}</p>
                    <p style={{ margin: "3px 0 0", color: "#f8fafc", fontSize: "0.82rem" }}>{String(value)}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}

        <div style={{ ...panelStyle, display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <Activity size={16} color="#fbbf24" style={{ marginTop: "2px" }} />
          <p style={{ margin: 0, color: "#e2e8f0", fontSize: "0.82rem", lineHeight: 1.6 }}>
            Historical records are stored locally in your browser for this prototype. For production, move history to secure backend storage.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 14px" }}>
      <p style={{ margin: 0, color: "#64748b", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <p style={{ margin: "6px 0 0", color, fontSize: "1.35rem", fontWeight: 800 }}>{value}</p>
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "14px 16px",
};

const btnGhost = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "9px",
  color: "#e2e8f0",
  padding: "8px 12px",
  cursor: "pointer",
};

const btnDanger = {
  ...btnGhost,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  border: "1px solid rgba(248,113,113,0.3)",
  color: "#fda4af",
  background: "rgba(239,68,68,0.1)",
};