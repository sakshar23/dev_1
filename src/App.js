import { useState, useEffect, useCallback } from "react";

const FALLBACK_QUOTES = [
  { _id: "f1", content: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["inspirational"] },
  { _id: "f2", content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", tags: ["perseverance"] },
  { _id: "f3", content: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", tags: ["courage"] },
  { _id: "f4", content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ["belief"] },
  { _id: "f5", content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["dreams"] },
];

const tagColors = {
  inspirational: "#f59e0b",
  perseverance: "#10b981",
  courage: "#ef4444",
  belief: "#8b5cf6",
  dreams: "#ec4899",
  default: "#6366f1",
};

export default function MotivationDashboard() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("likedQuotes") || "[]");
    } catch { return []; }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showLiked, setShowLiked] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setFadeIn(false);
    setUsedFallback(false);
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setQuote({ ...data, _id: String(data.id), content: data.quote, tags: ["inspirational"] });
    } catch {
      const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(fallback);
      setUsedFallback(true);
    } finally {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }
  }, []);

  useEffect(() => { fetchQuote(); }, [fetchQuote]);

  useEffect(() => {
    try { localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes)); } catch {}
  }, [likedQuotes]);

  const isLiked = quote ? likedQuotes.some(q => q._id === quote._id) : false;

  const toggleLike = () => {
    if (!quote) return;
    setLikedQuotes(prev =>
      prev.some(q => q._id === quote._id)
        ? prev.filter(q => q._id !== quote._id)
        : [...prev, quote]
    );
  };

  const removeLiked = (id) => setLikedQuotes(prev => prev.filter(q => q._id !== id));

  const filteredLiked = likedQuotes.filter(q =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tagColor = quote?.tags?.[0] ? (tagColors[quote.tags[0]] || tagColors.default) : tagColors.default;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
          background-attachment: fixed;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 27, 75, 0.5) 50%, rgba(49, 46, 129, 0.5) 100%);
          font-family: 'Inter', sans-serif;
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1rem 4rem;
          position: relative;
          overflow-x: hidden;
          perspective: 1000px;
        }

        /* 3D Space Background */
        .space-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        /* Floating Moon - Optimized */
        .floating-moon {
          position: fixed;
          top: 12%;
          right: 8%;
          width: 140px;
          height: 140px;
          pointer-events: none;
          z-index: 1;
          animation: floatMoon 4s ease-in-out infinite;
          will-change: transform;
        }

        .moon {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 35% 35%, #fef3c7, #fde047);
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 30px rgba(253, 224, 71, 0.3);
        }

        .moon::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 50%;
          top: 35%;
          left: 30%;
        }

        @keyframes floatMoon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Twinkling Stars - Optimized */
        .stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          will-change: opacity;
        }

        .star.small { width: 1px; height: 1px; }
        .star.medium { width: 2px; height: 2px; }

        .star.twinkle {
          animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        .bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          will-change: transform;
        }
        .orb1 { width: 500px; height: 500px; background: rgba(99, 102, 241, 0.12); top: -150px; right: -200px; animation: float 12s ease-in-out infinite; }
        .orb2 { width: 400px; height: 400px; background: rgba(168, 85, 247, 0.08); bottom: 0; left: -150px; animation: float 14s ease-in-out infinite 2s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }

        .content { position: relative; z-index: 1; width: 100%; max-width: 720px; }

        .header {
          text-align: center;
          margin-bottom: 3.5rem;
          padding-top: 1rem;
          animation: slideDown 0.8s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .header h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
        }

        .liked-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50px;
          padding: 0.6rem 1.2rem;
          font-size: 0.85rem;
          color: #e2e8f0;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
          will-change: transform, border-color;
          font-weight: 500;
        }
        .liked-badge:hover { 
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .quote-card {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 3rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
          will-change: transform, border-color;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .quote-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .quote-card.faded { opacity: 0; transform: translateY(12px); }
        .quote-card.visible { opacity: 1; transform: translateY(0); }

        .quote-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          border-radius: 24px 24px 0 0;
          transition: all 0.5s ease;
        }

        .quote-mark {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 5rem;
          line-height: 0.5;
          color: rgba(99, 102, 241, 0.2);
          position: absolute;
          top: 0.5rem;
          left: 1.5rem;
          pointer-events: none;
        }

        .quote-tag {
          display: inline-block;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1.5px solid;
          background: rgba(99, 102, 241, 0.12);
          color: #a5b4fc;
          border-color: #818cf8;
          transition: all 0.3s ease;
        }

        .quote-tag:hover {
          background: rgba(99, 102, 241, 0.18);
          transform: translateY(-2px);
        }

        .loading-shimmer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem 0;
        }

        .shimmer-line {
          height: 1rem;
          border-radius: 8px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .shimmer-line.long { width: 100%; }
        .shimmer-line.medium { width: 80%; }
        .shimmer-line.short { width: 45%; height: 0.85rem; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .quote-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          line-height: 1.7;
          font-weight: 500;
          color: #f1f5f9;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .quote-author {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #cbd5e1;
          text-transform: uppercase;
        }
        .quote-author span { color: #f1f5f9; }

        .api-note {
          font-size: 0.8rem;
          color: #94a3b8;
          text-align: center;
          margin-top: 0.75rem;
          font-weight: 500;
        }

        .actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
          animation: slideUp 0.8s ease 0.2s both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          will-change: transform, box-shadow;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          border: none;
        }
        .btn-primary:hover:not(:disabled) { 
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-like {
          flex: 0 0 auto;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          border-radius: 14px;
        }
        .btn-like.liked {
          background: rgba(236, 72, 153, 0.15);
          border-color: rgba(236, 72, 153, 0.4);
          color: #fb7185;
        }
        .btn-like:hover:not(:disabled) { 
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.12);
        }
        .btn-like.liked:hover:not(:disabled) {
          background: rgba(236, 72, 153, 0.2);
        }
        .btn-like:disabled { opacity: 0.5; cursor: not-allowed; }

        .heart-icon {
          font-size: 1.2rem;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
        }
        .btn-like.liked .heart-icon { transform: scale(1.25); }

        /* Liked section */
        .liked-section {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 2rem;
          animation: slideUp 0.3s cube-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .liked-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .liked-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.8rem 1.2rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #f1f5f9;
          outline: none;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }
        .search-input::placeholder { color: #64748b; }
        .search-input:focus { 
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .liked-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          max-height: 380px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .liked-list::-webkit-scrollbar { width: 6px; }
        .liked-list::-webkit-scrollbar-track { background: transparent; }
        .liked-list::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 3px; }
        .liked-list::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.6); }

        .liked-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.1rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
          will-change: transform, border-color;
        }

        .liked-item:hover {
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateX(2px);
        }

        .liked-item-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.6;
          color: #e2e8f0;
          flex: 1;
        }
        .liked-item-author {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 0.4rem;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          font-size: 1.1rem;
          padding: 0.25rem;
          line-height: 1;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .remove-btn:hover { 
          color: #fb7185;
          transform: scale(1.2) rotate(90deg);
        }

        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.6;
        }
      `}</style>

      <div className="app">
        {/* Stars background - Optimized */}
        <div className="stars-container">
          {Array.from({ length: 35 }).map((_, i) => {
            const size = i % 3 === 0 ? 'medium' : 'small';
            return (
              <div
                key={`star-${i}`}
                className={`star ${size} twinkle`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${(i * 0.1) % 3}s`,
                }}
              />
            );
          })}
        </div>

        {/* Floating Moon */}
        <div className="floating-moon">
          <div className="moon" />
        </div>

        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />

        <div className="content">
          {/* Header */}
          <div className="header">
            <div className="header-eyebrow">✦ Daily Wisdom ✦</div>
            <h1>Fuel Your Day</h1>
            <div
              className="liked-badge"
              onClick={() => setShowLiked(v => !v)}
            >
              ❤️ {likedQuotes.length} saved quote{likedQuotes.length !== 1 ? "s" : ""}
              <span style={{ marginLeft: "0.2rem", opacity: 0.6 }}>{showLiked ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* Quote Card */}
          <div className={`quote-card ${fadeIn ? "visible" : "faded"}`}>
            <div
              className="quote-accent"
              style={{ background: `linear-gradient(90deg, ${tagColor}, transparent)` }}
            />
            <div className="quote-mark">"</div>

            {loading ? (
              <div className="loading-shimmer">
                <div className="shimmer-line long" />
                <div className="shimmer-line long" />
                <div className="shimmer-line medium" />
                <div className="shimmer-line short" style={{ marginTop: "0.5rem" }} />
              </div>
            ) : quote ? (
              <>
                {quote.tags?.[0] && (
                  <span
                    className="quote-tag"
                    style={{
                      color: tagColor,
                      borderColor: `${tagColor}40`,
                      background: `${tagColor}12`,
                    }}
                  >
                    {quote.tags[0]}
                  </span>
                )}
                <p className="quote-text">"{quote.content}"</p>
                <p className="quote-author">— <span>{quote.author}</span></p>
              </>
            ) : null}
          </div>

          {usedFallback && (
            <p className="api-note">⚡ Using offline quotes — API unavailable</p>
          )}

          {/* Action Buttons */}
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={fetchQuote}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                  Fetching...
                </>
              ) : (
                <>✨ New Quote</>
              )}
            </button>
            <button
              className={`btn btn-like ${isLiked ? "liked" : ""}`}
              onClick={toggleLike}
              disabled={loading || !quote}
              title={isLiked ? "Unlike" : "Like this quote"}
            >
              <span className="heart-icon">{isLiked ? "❤️" : "🤍"}</span>
            </button>
          </div>

          {/* Liked Quotes Panel */}
          {showLiked && (
            <div className="liked-section">
              <div className="liked-header">
                <span className="liked-title">Saved Quotes</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(232,228,220,0.4)" }}>
                  {filteredLiked.length} / {likedQuotes.length}
                </span>
              </div>

              <input
                type="text"
                className="search-input"
                placeholder="Search quotes or authors…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              <div className="liked-list">
                {filteredLiked.length === 0 ? (
                  <div className="empty-state">
                    {likedQuotes.length === 0
                      ? "No saved quotes yet. Like a quote to save it! 💛"
                      : "No quotes match your search."}
                  </div>
                ) : (
                  filteredLiked.map(q => (
                    <div key={q._id} className="liked-item">
                      <div>
                        <div className="liked-item-text">"{q.content}"</div>
                        <div className="liked-item-author">— {q.author}</div>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeLiked(q._id)}
                        title="Remove"
                      >✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}