import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TwoFAStep = "off" | "setup" | "on" | "confirming";
interface Session {
  id: string;
  device: string;
  location: string;
  time: string;
  current: boolean;
  type: "desktop" | "mobile";
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ShieldCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9,12 11,14 15,10" />
  </svg>
);
const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="5" />
    <path d="M21 2l-9.6 9.6M15.5 7.5l3 3" />
  </svg>
);
const MonitorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const SmartphoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
);
const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── QR Code (visual placeholder — swap with real QR library in production) ──
const QR_SIZE = 21;
const qrGrid = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const r = Math.floor(i / QR_SIZE);
  const c = i % QR_SIZE;
  // Top-left finder pattern
  if (r < 7 && c < 7) {
    if (r === 0 || r === 6 || c === 0 || c === 6) return true;
    if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
    return false;
  }
  // Top-right finder pattern
  if (r < 7 && c >= 14) {
    const cc = c - 14;
    if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
    if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
    return false;
  }
  // Bottom-left finder pattern
  if (r >= 14 && c < 7) {
    const rr = r - 14;
    if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
    if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
    return false;
  }
  // Timing patterns
  if (r === 6 && c >= 8 && c <= 12) return c % 2 === 0;
  if (c === 6 && r >= 8 && r <= 12) return r % 2 === 0;
  // Alignment pattern
  if (r >= 16 && r <= 18 && c >= 16 && c <= 18) {
    if (r === 16 || r === 18 || c === 16 || c === 18) return true;
    if (r === 17 && c === 17) return true;
    return false;
  }
  // Data area (deterministic pseudo-random)
  return ((r * 31 + c * 17 + (r * c) % 7) % 100) < 47;
});

const QRCode = () => (
  <div style={{ background: "#fff", padding: 10, borderRadius: 10, display: "inline-block" }}>
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${QR_SIZE}, 8px)`,
      gridTemplateRows: `repeat(${QR_SIZE}, 8px)`,
    }}>
      {qrGrid.map((filled, i) => (
        <div key={i} style={{ width: 8, height: 8, background: filled ? "#111827" : "#fff" }} />
      ))}
    </div>
  </div>
);

// ─── Static data ──────────────────────────────────────────────────────────────
const BACKUP_CODES = [
  "A1B2-C3D4", "E5F6-G7H8", "I9J0-K1L2", "M3N4-O5P6",
  "Q7R8-S9T0", "U1V2-W3X4", "Y5Z6-A7B8", "C9D0-E1F2",
];

const INITIAL_SESSIONS: Session[] = [
  { id: "1", device: "Chrome · macOS Ventura",  location: "Singapore",        time: "Active now",  current: true,  type: "desktop" },
  { id: "2", device: "Safari · iPhone 15 Pro",  location: "Singapore",        time: "2 hours ago", current: false, type: "mobile"  },
  { id: "3", device: "Firefox · Windows 11",    location: "Unknown location", time: "3 days ago",  current: false, type: "desktop" },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 16,
  padding: 28,
};

const iconBox = (color: string, borderColor: string, bg: string): React.CSSProperties => ({
  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
  background: bg, border: `1px solid ${borderColor}`,
  display: "flex", alignItems: "center", justifyContent: "center", color,
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function SecurityPage() {
  const [step, setStep]         = useState<TwoFAStep>("off");
  const [code, setCode]         = useState("");
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [codesOpen, setCodesOpen] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));

  const handleVerify = () => {
    if (code.length === 6) { setStep("on"); setCode(""); }
  };

  const handleRevoke = (id: string) => {
    setRevoking(id);
    setTimeout(() => { setSessions(p => p.filter(s => s.id !== id)); setRevoking(null); }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(BACKUP_CODES.join("\n")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisable = () => { setStep("off"); setCodesOpen(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        .sec { font-family: 'Outfit', sans-serif; }
        .btn {
          border: none; cursor: pointer; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 500; border-radius: 8px;
          transition: all 0.18s; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn:active { transform: scale(0.97) !important; }
        .btn-primary { background: linear-gradient(135deg, #5b5cf6, #818cf8); color: #fff; padding: 10px 20px; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(91,92,246,0.35); }
        .btn-primary:disabled { opacity: 0.32; cursor: not-allowed; transform: none !important; box-shadow: none; }
        .btn-ghost { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); color: #94a3b8; padding: 10px 16px; }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
        .btn-danger { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.18); color: #fca5a5; padding: 10px 20px; }
        .btn-danger:hover { background: rgba(239,68,68,0.18); }
        .btn-sm { padding: 7px 13px !important; font-size: 12px; }
        .code-input {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #e2e8f0; outline: none; width: 100%;
          padding: 14px 16px; font-size: 22px; letter-spacing: 0.4em;
          text-align: center; font-family: 'JetBrains Mono', monospace; font-weight: 500;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .code-input::placeholder { color: rgba(255,255,255,0.12); font-size: 16px; letter-spacing: 0.25em; }
        .code-input:focus { border-color: rgba(91,92,246,0.55); box-shadow: 0 0 0 3px rgba(91,92,246,0.1); }
        .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 24px 0; }
        .session-row { transition: opacity 0.35s, transform 0.35s; }
        .session-row.exit { opacity: 0; transform: translateX(18px); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeSlideIn 0.28s ease both; }
        @media (max-width: 580px) {
          .setup-grid { flex-direction: column-reverse !important; }
          .qr-col { align-items: center !important; margin-bottom: 8px; }
          .codes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .card-top { flex-direction: column !important; gap: 16px !important; }
          .card-top .cta { margin-left: 58px; }
        }
      `}</style>

      {/* ── Full page ── */}
      <div className="sec" style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse at 0% 35%,  rgba(91,92,246,0.09) 0%, transparent 55%),
          radial-gradient(ellipse at 100% 8%,  rgba(6,182,212,0.06) 0%, transparent 48%),
          radial-gradient(ellipse at 55% 100%, rgba(91,92,246,0.05) 0%, transparent 48%),
          #07090f
        `,
        padding: "52px 20px 80px",
        color: "#e2e8f0",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* ── Page header ── */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(91,92,246,0.28), rgba(129,140,248,0.12))",
                border: "1px solid rgba(91,92,246,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8",
              }}>
                <ShieldIcon />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.025em" }}>
                Security
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "#3d4f6a", marginLeft: 50 }}>
              Manage two-factor authentication and active sessions.
            </p>
          </div>

          {/* ════════════════════════════════════
              TWO-FACTOR AUTHENTICATION CARD
          ════════════════════════════════════ */}
          <div style={{ ...CARD, marginBottom: 14 }}>

            {/* Header row */}
            <div className="card-top" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={iconBox(
                  step === "on" ? "#34d399" : "#818cf8",
                  step === "on" ? "rgba(52,211,153,0.22)" : "rgba(91,92,246,0.22)",
                  step === "on" ? "rgba(52,211,153,0.09)" : "rgba(91,92,246,0.09)",
                )}>
                  {step === "on" ? <ShieldCheckIcon /> : <ShieldIcon />}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9" }}>
                      Two-Factor Authentication
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                      padding: "2px 8px", borderRadius: 20,
                      background: step === "on" ? "rgba(52,211,153,0.1)"   : "rgba(248,113,113,0.1)",
                      border:     step === "on" ? "1px solid rgba(52,211,153,0.22)" : "1px solid rgba(248,113,113,0.15)",
                      color:      step === "on" ? "#34d399" : "#f87171",
                    }}>
                      {step === "on" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, maxWidth: 370 }}>
                    {step === "on"
                      ? "Your account is protected. A code is required on every sign-in."
                      : "Add an extra layer of protection with a time-based code from your authenticator app."}
                  </p>
                </div>
              </div>

              <div className="cta" style={{ flexShrink: 0 }}>
                {step === "off"       && <button className="btn btn-primary" onClick={() => setStep("setup")}>Enable</button>}
                {step === "on"        && <button className="btn btn-ghost"   onClick={() => setStep("confirming")}>Disable</button>}
                {step === "setup"     && <button className="btn btn-ghost btn-sm" onClick={() => { setStep("off"); setCode(""); }}>Cancel</button>}
                {step === "confirming"&& null}
              </div>
            </div>

            {/* ── SETUP FLOW ── */}
            {step === "setup" && (
              <div className="fade-in">
                <div className="divider" />
                <div className="setup-grid" style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>

                  {/* Steps + input */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {[
                      { n: "1", title: "Get an authenticator app",    body: "Download Google Authenticator, Authy, or 1Password on your phone." },
                      { n: "2", title: "Scan the QR code",            body: "Open your app and scan the code, or enter the setup key manually." },
                      { n: "3", title: "Enter the verification code", body: "Type the 6-digit code shown in your app to confirm setup." },
                    ].map(s => (
                      <div key={s.n} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                          background: "rgba(91,92,246,0.12)", border: "1px solid rgba(91,92,246,0.25)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700, color: "#818cf8",
                        }}>{s.n}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 3 }}>{s.title}</div>
                          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.65 }}>{s.body}</div>
                        </div>
                      </div>
                    ))}

                    <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#334155", display: "block", marginBottom: 8, marginTop: 4 }}>
                      Verification Code
                    </label>
                    <input
                      className="code-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="• • •   • • •"
                      value={code}
                      onChange={handleCodeChange}
                    />
                    <button
                      className="btn btn-primary"
                      disabled={code.length !== 6}
                      onClick={handleVerify}
                      style={{ width: "100%", justifyContent: "center", marginTop: 10, padding: "12px" }}
                    >
                      Verify &amp; Enable 2FA
                    </button>
                  </div>

                  {/* QR code */}
                  <div className="qr-col" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                    <QRCode />
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      letterSpacing: "0.08em", color: "#334155",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 6, padding: "6px 10px", textAlign: "center",
                    }}>
                      KBZW E5VH QLMP 23TN
                    </div>
                    <span style={{ fontSize: 11, color: "#2d3a4d" }}>Setup key for manual entry</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── CONFIRM DISABLE ── */}
            {step === "confirming" && (
              <div className="fade-in">
                <div className="divider" />
                <div style={{
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.14)",
                  borderRadius: 10, padding: "14px 16px", display: "flex", gap: 12, marginBottom: 18,
                }}>
                  <div style={{ color: "#f87171", flexShrink: 0, paddingTop: 1 }}><WarningIcon /></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fca5a5", marginBottom: 4 }}>
                      This will reduce your account security
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(239,68,68,0.55)", lineHeight: 1.7 }}>
                      Without 2FA, anyone who obtains your password will have full access to your account. We strongly recommend keeping it enabled.
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-danger"  style={{ flex: 1, justifyContent: "center" }} onClick={handleDisable}>
                    Disable 2FA
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep("on")}>
                    Keep enabled
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════
              BACKUP CODES CARD (only when 2FA is on)
          ════════════════════════════════════ */}
          {step === "on" && (
            <div style={{ ...CARD, marginBottom: 14 }} className="fade-in">
              <div className="card-top" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={iconBox("#fbbf24", "rgba(245,158,11,0.22)", "rgba(245,158,11,0.08)")}>
                    <KeyIcon />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9", marginBottom: 4 }}>
                      Backup Codes
                    </div>
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, maxWidth: 370 }}>
                      Single-use recovery codes for when you can't access your authenticator app. Store them somewhere safe.
                    </p>
                  </div>
                </div>
                <div className="cta">
                  <button className="btn btn-ghost btn-sm" onClick={() => setCodesOpen(o => !o)}>
                    {codesOpen ? "Hide" : "View codes"}
                  </button>
                </div>
              </div>

              {codesOpen && (
                <div className="fade-in">
                  <div className="divider" />
                  <div className="codes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
                    {BACKUP_CODES.map((c, i) => (
                      <div key={i} style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 8, padding: "9px 0", textAlign: "center",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
                        color: "#94a3b8", letterSpacing: "0.06em",
                      }}>
                        {c}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? "Copied!" : "Copy all"}
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <RefreshIcon /> Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════
              ACTIVE SESSIONS CARD
          ════════════════════════════════════ */}
          <div style={{ ...CARD }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
              <div style={iconBox("#818cf8", "rgba(91,92,246,0.22)", "rgba(91,92,246,0.09)")}>
                <MonitorIcon />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9", marginBottom: 4 }}>
                  Active Sessions
                </div>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                  All devices currently signed in to your account.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sessions.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "#2d3a4d", fontSize: 13 }}>
                  No other active sessions.
                </div>
              )}
              {sessions.map(s => (
                <div
                  key={s.id}
                  className={`session-row ${revoking === s.id ? "exit" : ""}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 14px", borderRadius: 10,
                    background: s.current ? "rgba(91,92,246,0.06)"   : "rgba(255,255,255,0.025)",
                    border:     s.current ? "1px solid rgba(91,92,246,0.15)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ color: s.current ? "#818cf8" : "#3d4f6a", flexShrink: 0 }}>
                    {s.type === "mobile" ? <SmartphoneIcon /> : <MonitorIcon />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1" }}>{s.device}</span>
                      {s.current && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                          background: "rgba(91,92,246,0.12)", border: "1px solid rgba(91,92,246,0.2)",
                          color: "#818cf8", padding: "2px 7px", borderRadius: 20,
                        }}>
                          This device
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#334155", display: "flex", alignItems: "center", gap: 3 }}>
                        <PinIcon /> {s.location}
                      </span>
                      <span style={{ fontSize: 12, color: "#1e293b" }}>·</span>
                      <span style={{ fontSize: 12, color: s.current ? "rgba(91,92,246,0.65)" : "#334155" }}>
                        {s.time}
                      </span>
                    </div>
                  </div>
                  {!s.current && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ flexShrink: 0, color: "#64748b" }}
                      onClick={() => handleRevoke(s.id)}
                    >
                      <CloseIcon /> Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}