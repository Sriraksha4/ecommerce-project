import React, { useState, useContext } from "react";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

const AIGenerator = () => {
  const { theme } = useContext(ThemeContext);
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  
  const [result, setResult] = useState(null); // Will hold parsed JSON data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResult(null);

    if (!productName) {
      setError("Please specify a Product Name.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/ai/generate-description", {
        productName,
        features,
        specifications,
        targetAudience: `${targetAudience} (Tone: ${tone})`
      });

      if (response.data.success) {
        setResult(response.data.data);
        setSuccess("Gemini AI copy generated successfully!");
      } else {
        setError("AI Generation failed. The API might be experiencing issues.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error calling AI services. Check API key configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="fade-in">
      {/* Alert Banners */}
      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-check-circle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-white fw-bold m-0">AI Copywriter Workspace</h2>
        <p className="text-muted small mb-0">Generate premium e-commerce content powered by Google Gemini API</p>
      </div>

      <div className="row g-4">
        {/* Parameters Column */}
        <div className="col-12 col-lg-5">
          <div 
            className="p-4 rounded-4 border shadow-sm ai-glowing-card"
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.4)", 
              borderColor: "var(--card-border)" 
            }}
          >
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi-magic text-primary me-2"></i> Input Parameters
            </h5>
            <form onSubmit={handleGenerate}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">PRODUCT NAME *</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="e.g. Aura Pro Sound headphones"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">KEY FEATURES</label>
                <textarea
                  className="form-control"
                  rows="2"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="e.g. 40dB active noise cancellation, 50-hour battery, Bluetooth 5.3"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">SPECIFICATIONS</label>
                <textarea
                  className="form-control"
                  rows="2"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="e.g. Drivers: 40mm, Weight: 250g, Type-C charging"
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">TARGET AUDIENCE</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="e.g. Gamers, Remote workers, Audiophiles"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">ADVERTISING TONE</label>
                <select
                  className="form-select"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                >
                  <option value="Professional">Professional & Informative</option>
                  <option value="Luxury">Luxury & Premium</option>
                  <option value="Casual">Casual & Friendly</option>
                  <option value="Energetic">Energetic & Punchy</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-gradient w-100 py-3 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>AI Writing...</span>
                  </>
                ) : (
                  <>
                    <i className="bi-cpu me-2"></i> Generate Description
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* AI Output Result Box */}
        <div className="col-12 col-lg-7">
          <div 
            className="p-4 rounded-4 border shadow-sm h-100 d-flex flex-column ai-glowing-card"
            style={{ 
              minHeight: "350px",
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.4)", 
              borderColor: "var(--card-border)" 
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: "var(--card-border)" }}>
              <h5 className="fw-bold m-0 d-flex align-items-center">
                <i className="bi-chat-left-quote text-purple me-2"></i> Generated Output
              </h5>
            </div>

            {loading ? (
              <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center py-5">
                <div className="spinner-grow text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted small m-0 animate-pulse">Gemini copywriter is writing descriptions, please wait...</p>
              </div>
            ) : result ? (
              <div className="d-flex flex-column gap-3 overflow-y-auto" style={{ maxHeight: "450px" }}>
                {/* 1. Description */}
                <div className="p-3 rounded-3" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid var(--card-border)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="small text-primary text-uppercase">Product Description</strong>
                    <button onClick={() => handleCopyText(result.description)} className="btn btn-sm btn-link p-0 text-decoration-none">
                      <i className="bi-copy"></i> Copy
                    </button>
                  </div>
                  <p className="small m-0 text-muted lh-base">{result.description}</p>
                </div>

                {/* 2. SEO Meta Description */}
                <div className="p-3 rounded-3" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid var(--card-border)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="small text-success text-uppercase">SEO Meta Description</strong>
                    <button onClick={() => handleCopyText(result.seoDescription)} className="btn btn-sm btn-link p-0 text-decoration-none">
                      <i className="bi-copy"></i> Copy
                    </button>
                  </div>
                  <p className="small m-0 text-muted lh-base">{result.seoDescription}</p>
                </div>

                {/* 3. Highlights */}
                <div className="p-3 rounded-3" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid var(--card-border)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="small text-warning text-uppercase">Highlights</strong>
                    <button onClick={() => handleCopyText(result.highlights?.join("\n"))} className="btn btn-sm btn-link p-0 text-decoration-none">
                      <i className="bi-copy"></i> Copy List
                    </button>
                  </div>
                  <ul className="small m-0 text-muted ps-3">
                    {result.highlights?.map((hl, idx) => <li key={idx}>{hl}</li>)}
                  </ul>
                </div>

                {/* 4. Specifications Bullet points */}
                <div className="p-3 rounded-3" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid var(--card-border)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="small text-purple text-uppercase">Key Bullet Points</strong>
                    <button onClick={() => handleCopyText(result.bulletPoints?.join("\n"))} className="btn btn-sm btn-link p-0 text-decoration-none">
                      <i className="bi-copy"></i> Copy List
                    </button>
                  </div>
                  <ul className="small m-0 text-muted ps-3">
                    {result.bulletPoints?.map((bp, idx) => <li key={idx}>{bp}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center py-5 text-muted">
                <i className="bi-cpu fs-1 mb-2"></i>
                <p className="mb-0 small">Generated product copy will display here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
