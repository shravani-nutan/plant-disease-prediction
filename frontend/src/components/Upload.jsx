import { useState } from "react";
import axios from "axios";
import { useLang, LANGUAGES } from "../LangContext";
import Footer from "./Footer";

const BG = "https://png.pngtree.com/thumb_back/fh260/background/20240704/pngtree-view-of-an-agriculturally-used-field-with-green-grass-image_15859062.jpg";

function Section({ color, emoji, title, text }) {
  return (
    <div className={`p-4 rounded-2xl ${color} border border-white/60 shadow-sm`}>
      <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">{emoji} {title}</p>
      <p className="text-gray-700 leading-relaxed text-sm">{text}</p>
    </div>
  );
}

function Upload({ username, onLogout }) {
  const { lang, setLang, t } = useLang();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setTranslated(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert(t.selectImage);
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setTranslated(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict/", formData);
      setResult(res.data);
      if (lang !== "en") translateResult(res.data, lang);
    } catch {
      setResult({ error: t.backendError });
    } finally {
      setLoading(false);
    }
  };

  const translateResult = async (data, targetLang) => {
    setTranslating(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/translate", {
        texts: {
          farmer_tip: data.farmer_tip,
          homemade_solution: data.homemade_solution,
          field_manner: data.field_manner,
          solution: data.solution,
          description: data.description,
          medicine: data.medicine,
          disease: data.disease.replace(/_/g, " "),
        },
        target_lang: targetLang,
      });
      setTranslated(res.data);
    } catch {
      setTranslated(null);
    } finally {
      setTranslating(false);
    }
  };

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    if (result && newLang !== "en") translateResult(result, newLang);
    if (newLang === "en") setTranslated(null);
  };

  const get = (key) => (translated && translated[key]) ? translated[key] : result?.[key];
  const isHealthy = result?.disease?.toLowerCase().includes("healthy");

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 min-h-screen">
        {/* Navbar */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-3 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-none">KisanAI</h1>
              <p className="text-green-300 text-xs">Plant Disease Detector</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={handleLangChange}
              className="bg-white/20 text-white border border-white/30 rounded-xl px-3 py-1 text-sm focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-black">{l.label}</option>
              ))}
            </select>
            <div className="text-right">
              <p className="text-white text-sm font-semibold">{t.hi} {username}</p>
              <button onClick={onLogout} className="text-red-300 text-xs hover:underline">{t.logout}</button>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="text-center py-10 px-4">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">🌿 {t.appName}</h2>
          <p className="text-green-200 mt-2 text-lg">Upload a leaf photo — get instant disease diagnosis & treatment</p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 pb-12 space-y-4">

          {/* Upload Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-4 border border-white/60">
            <div className="border-2 border-dashed border-green-300 rounded-2xl p-4 text-center bg-green-50/50">
              <p className="text-4xl mb-2">📷</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />
            </div>

            {translating && (
              <p className="text-xs text-green-600 animate-pulse text-center">🌐 {t.translating}</p>
            )}

            {preview && (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full h-56 object-cover rounded-2xl shadow-md" />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">📸 Leaf Preview</div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-4 rounded-2xl font-extrabold text-lg hover:from-green-600 hover:to-green-800 transition-all disabled:from-gray-400 disabled:to-gray-500 shadow-lg"
            >
              {loading ? `⏳ ${t.analyzing}` : `🔍 ${t.checkHealth}`}
            </button>
          </div>

          {/* Result */}
          {result && !result.error && (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-4 border border-white/60">

              {/* Disease Badge */}
              <div className={`p-5 rounded-2xl text-center ${isHealthy ? "bg-green-100 border-2 border-green-400" : "bg-red-100 border-2 border-red-400"}`}>
                <p className="text-4xl mb-1">{isHealthy ? "✅" : "⚠️"}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">{t.detected}</p>
                <p className="text-2xl font-extrabold text-gray-800">{translated?.disease || result.disease.replace(/_/g, " ")}</p>
                <div className="mt-2 inline-block bg-white rounded-full px-4 py-1 text-sm font-semibold text-gray-600 shadow">
                  {t.confidence} {result.confidence}%
                </div>
              </div>

              <Section color="bg-blue-50" emoji="ℹ️" title={t.about} text={get("description")} />
              <Section color="bg-yellow-50" emoji="💊" title={t.technicalSolution} text={get("solution")} />

              {/* Medicines */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-white/60 shadow-sm">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3">{t.suggestedMedicines}</p>
                <div className="flex flex-wrap gap-2">
                  {(translated?.medicine || result.medicine).split(",").map((med, i) => (
                    <span key={i} className="bg-purple-200 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      💊 {med.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <Section color="bg-orange-50" emoji="🌾" title={t.farmersGuide} text={get("farmer_tip")} />
              <Section color="bg-lime-50" emoji="🏡" title={t.homemadeSolution} text={get("homemade_solution")} />
              <Section color="bg-teal-50" emoji="🚜" title={t.fieldManners} text={get("field_manner")} />
            </div>
          )}

          {result?.error && (
            <div className="bg-red-100 border-2 border-red-400 p-4 rounded-2xl text-center">
              <p className="text-red-700 font-semibold">{result.error}</p>
            </div>
          )}

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Upload;
