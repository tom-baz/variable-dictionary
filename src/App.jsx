import { useState, useMemo, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";
import VARIABLES from "./data/variables.json";
import labLogo from "./lab-logo.png";

/* ─── CONSTANTS ─────────────────────────────────────────────────────────────── */

const TYPE_COLORS = {
  wage:           { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
  capital:        { bg: "#E3F2FD", text: "#1565C0", border: "#90CAF9" },
  benefits:       { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  demographics:   { bg: "#F3E5F5", text: "#6A1B9A", border: "#CE93D8" },
  "wage, capital": { bg: "#ECEFF1", text: "#37474F", border: "#B0BEC5" },
  "class":          { bg: "#FFF9C4", text: "#F57F17", border: "#FFF176" },
  generation:       { bg: "#E0F2F1", text: "#00695C", border: "#80CBC4" },
  ethnicity:        { bg: "#FCE4EC", text: "#AD1457", border: "#F48FB1" },
  premium:          { bg: "#E8EAF6", text: "#283593", border: "#9FA8DA" },
};

const SOURCE_DESCRIPTIONS = {
  tbl_hahnsotpratt87_21: "Individual tax data",
  tbl_misrot27_21:       "Employer records",
  tbl_source:            "Tax file source",
  "firm data":           "Firm-level data",
  computed:              "Computed variable",
  "national accounts":   "National accounts data",
  tbl_x2022:             "Population registry cross-section 2022",
};

/* ─── SMALL COMPONENTS ──────────────────────────────────────────────────────── */

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS["wage"];
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: "12px",
      fontSize: "11px", fontWeight: 600, letterSpacing: "0.03em",
      textTransform: "uppercase", background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {type}
    </span>
  );
}

function InputPill({ name, isClickable, onClick }) {
  return (
    <span
      onClick={isClickable ? onClick : undefined}
      style={{
        display: "inline-block", padding: "3px 10px", margin: "2px 4px 2px 0",
        borderRadius: "6px", fontSize: "12.5px",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        background: isClickable ? "#FFF8E1" : "#F5F5F5",
        color: isClickable ? "#F57F17" : "#757575",
        border: isClickable ? "1px solid #FFE082" : "1px solid #E0E0E0",
        cursor: isClickable ? "pointer" : "default",
        transition: "all 0.15s ease",
      }}
      title={isClickable ? `Click to view ${name}` : "CBS source variable"}
    >
      {isClickable && "→ "}{name}
    </span>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, [code]);
  return (
    <div style={{ position: "relative", marginTop: "8px" }}>
      <button onClick={handleCopy} style={{
        position: "absolute", top: "8px", right: "8px", zIndex: 1,
        background: copied ? "#4CAF50" : "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px",
        color: "#fff", fontSize: "11px", padding: "3px 8px", cursor: "pointer",
      }}>
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre style={{
        background: "#1E1E2E", padding: "16px 18px",
        borderRadius: "8px", fontSize: "12.5px", lineHeight: "1.65",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        overflowX: "auto", margin: 0, border: "1px solid #313244",
      }}>
        <code ref={codeRef} className="language-python">{code}</code>
      </pre>
    </div>
  );
}

const labelStyle = {
  fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.08em", color: "#90A4AE",
};

/* ─── DETAIL PANEL ──────────────────────────────────────────────────────────── */

function VariableDetail({ variable, allVarNames, onSelectVar }) {
  if (!variable) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", color: "#9E9E9E", fontSize: "18px", fontStyle: "italic",
        padding: "40px", textAlign: "center",
      }}>
        <div>
          <img src={labLogo} alt="Income Inequality Lab" style={{ width: "280px", marginBottom: "16px", opacity: 0.7 }} />
          <div>Select a variable from the list to view its details</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 32px", overflowY: "auto", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "6px" }}>
        <h2 style={{
          margin: 0, fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "20px", fontWeight: 700, color: "#1A1A2E",
        }}>
          {variable.name}
        </h2>
        {variable.tag && (
          <span style={{
            fontSize: "10px", padding: "2px 8px", background: "#E8EAF6",
            color: "#3949AB", borderRadius: "4px", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            {variable.tag}
          </span>
        )}
      </div>

      <p style={{ color: "#546E7A", fontSize: "15px", margin: "8px 0 20px", lineHeight: "1.5" }}>
        {variable.definition}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Type</label>
          <div style={{ marginTop: "4px" }}><TypeBadge type={variable.type} /></div>
        </div>
        <div>
          <label style={labelStyle}>Source Table(s)</label>
          <div style={{ marginTop: "4px", fontSize: "13px", color: "#37474F" }}>
            {variable.source.split(", ").map((s, i) => (
              <div key={i} style={{ marginBottom: "2px" }}>
                <span style={{ fontFamily: "monospace", fontWeight: 500 }}>{s}</span>
                {SOURCE_DESCRIPTIONS[s] && (
                  <span style={{ color: "#90A4AE", fontSize: "11px", marginLeft: "6px" }}>
                    — {SOURCE_DESCRIPTIONS[s]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {variable.notebook && (
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Notebook</label>
          <div style={{
            marginTop: "4px", fontFamily: "monospace", fontSize: "13px",
            color: "#1565C0", background: "#E3F2FD", display: "inline-block",
            padding: "3px 10px", borderRadius: "4px",
          }}>
            {variable.notebook}
          </div>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Construction Logic</label>
        <p style={{
          margin: "6px 0 0", fontSize: "13.5px", lineHeight: "1.6", color: "#37474F",
          background: "#FAFAFA", padding: "12px 14px", borderRadius: "6px",
          border: "1px solid #ECEFF1",
        }}>
          {variable.logic}
        </p>
      </div>

      {variable.inputs && variable.inputs.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Input Variables</label>
          <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap" }}>
            {variable.inputs.map((inp) => (
              <InputPill
                key={inp} name={inp}
                isClickable={allVarNames.has(inp)}
                onClick={() => onSelectVar(inp)}
              />
            ))}
          </div>
        </div>
      )}

      {variable.code && variable.code.trim() !== "" && (
        <div>
          <label style={labelStyle}>Python Code</label>
          <CodeBlock code={variable.code} />
        </div>
      )}
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────────────────────── */

export default function App() {
  const strategies = Object.keys(VARIABLES);
  const [activeStrategy, setActiveStrategy] = useState(strategies[0]);
  const [selectedVar, setSelectedVar] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const vars = VARIABLES[activeStrategy] || [];

  const allVarNames = useMemo(() => {
    const names = new Set();
    Object.values(VARIABLES).forEach(list => list.forEach(v => names.add(v.name)));
    return names;
  }, []);

  const types = useMemo(() => {
    const t = new Set();
    vars.forEach((v) => t.add(v.type));
    return ["all", ...Array.from(t)];
  }, [activeStrategy]);

  const filteredVars = useMemo(() => {
    return vars.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery
        || v.name.toLowerCase().includes(q)
        || v.definition.toLowerCase().includes(q);
      const matchType = filterType === "all" || v.type === filterType;
      return matchSearch && matchType;
    });
  }, [vars, searchQuery, filterType]);

  const handleSelectVar = (varName) => {
    let v = vars.find((x) => x.name === varName);
    if (v) { setSelectedVar(v); return; }
    for (const strat of strategies) {
      if (strat === activeStrategy) continue;
      v = (VARIABLES[strat] || []).find((x) => x.name === varName);
      if (v) {
        setActiveStrategy(strat);
        setSelectedVar(v);
        setSearchQuery("");
        setFilterType("all");
        return;
      }
    }
  };

  useEffect(() => {
    setSelectedVar(null);
    setSearchQuery("");
    setFilterType("all");
  }, [activeStrategy]);

  return (
    <div style={{
      fontFamily: "'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif",
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#FAFBFC", color: "#1A1A2E",
    }}>
      <header style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        color: "#fff", padding: "16px 28px",
        display: "flex", alignItems: "center",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Variable Dictionary</h1>
          <p style={{ margin: "2px 0 0", fontSize: "12px", opacity: 0.6 }}>
            DIWA - Feature Extraction
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", flex: 1, justifyContent: "center" }}>
          {strategies.map((s) => (
            <button key={s} onClick={() => setActiveStrategy(s)} style={{
              padding: "7px 16px", borderRadius: "6px", border: "none",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              background: activeStrategy === s ? "rgba(255,255,255,0.2)" : "transparent",
              color: activeStrategy === s ? "#fff" : "rgba(255,255,255,0.5)",
            }}>
              {s}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{
          width: "320px", flexShrink: 0, borderRight: "1px solid #E0E0E0",
          display: "flex", flexDirection: "column", background: "#fff",
        }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #ECEFF1" }}>
            <input
              type="text" placeholder="Search variables..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0",
                borderRadius: "6px", fontSize: "13px", outline: "none",
                boxSizing: "border-box", background: "#FAFAFA",
              }}
            />
            <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
              {types.map((t) => (
                <button key={t} onClick={() => setFilterType(t)} style={{
                  padding: "3px 10px", borderRadius: "12px",
                  border: filterType === t ? "1px solid #1565C0" : "1px solid #E0E0E0",
                  background: filterType === t ? "#E3F2FD" : "transparent",
                  color: filterType === t ? "#1565C0" : "#9E9E9E",
                  fontSize: "11px", fontWeight: 600, cursor: "pointer",
                  textTransform: "capitalize",
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredVars.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "#BDBDBD", fontSize: "13px" }}>
                No variables match
              </div>
            )}
            {filteredVars.map((v) => {
              const isSelected = selectedVar && selectedVar.name === v.name;
              return (
                <div key={v.name} onClick={() => setSelectedVar(v)} style={{
                  padding: "12px 16px", cursor: "pointer",
                  borderBottom: "1px solid #F5F5F5",
                  background: isSelected ? "#E8F0FE" : "transparent",
                  borderLeft: isSelected ? "3px solid #1565C0" : "3px solid transparent",
                  transition: "all 0.1s",
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
                    fontWeight: 600, color: isSelected ? "#1565C0" : "#1A1A2E",
                    marginBottom: "3px",
                  }}>
                    {v.name}
                  </div>
                  <div style={{
                    fontSize: "11.5px", color: "#90A4AE", lineHeight: "1.4",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {v.definition}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            padding: "10px 16px", borderTop: "1px solid #ECEFF1",
            fontSize: "11px", color: "#BDBDBD", textAlign: "center",
          }}>
            {filteredVars.length} / {vars.length} variables
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          <VariableDetail
            variable={selectedVar}
            allVarNames={allVarNames}
            onSelectVar={handleSelectVar}
          />
        </div>
      </div>
    </div>
  );
}
