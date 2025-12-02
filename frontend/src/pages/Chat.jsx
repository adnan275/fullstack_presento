import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./chat.css";

export default function Chat() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      console.log("Generating response for:", query);
      setResponse("AI response placeholder - integrate your AI API here");
    } catch (error) {
      console.error(error);
      setResponse("Failed to generate response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-content">
          <h1>🤖 AI Assistant</h1>
          <p>Ask anything about our products</p>
        </div>
        <div className="header-actions">
          <Link to="/shop" className="btn-nav">
            Products
          </Link>
        </div>
      </header>

      <div className="chat-container">
        <section className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Ask me anything about our products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
              className="search-input"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !query.trim()}
              className="btn-generate"
            >
              {loading ? "⏳ Generating..." : "✨ Ask"}
            </button>
          </div>

          {response && (
            <div className="response-box">
              <div className="response-content">
                <h3>Response:</h3>
                <p>{response}</p>
              </div>
              <button
                onClick={() => {
                  setResponse("");
                  setQuery("");
                }}
                className="btn-clear"
              >
                Clear
              </button>
            </div>
          )}

          {!response && !loading && (
            <div className="placeholder-box">
              <p>💬 Ask me anything about products, prices, or recommendations!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}