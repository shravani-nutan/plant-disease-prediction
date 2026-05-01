import { useState, useRef } from "react";
import axios from "axios";
import { useLang, LANGUAGES } from "../LangContext";
import Footer from "./Footer";

const BG = "https://png.pngtree.com/thumb_back/fh260/background/20240704/pngtree-view-of-an-agriculturally-used-field-with-green-grass-image_15859062.jpg";

const TABS = [
  { key: "about",     emoji: "ℹ️",  label: "About" },
  { key: "solution",  emoji: "💊",  label: "Solution" },
  { key: "medicine",  emoji: "💉",  label: "Medicines" },
  { key: "farmer",    emoji: "🌾",  label: "Farmer Guide" },
  { key: "homemade",  emoji: "🏡",  label: "Home Remedy" },
  { key: "field",     emoji: "🚜",  label: "Field Tips" },
];

function FarmerAvatar({ speaking, paused }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-20 h-20 rounded-full border-4 ${speaking && !paused ? "border-green-400 shadow-lg shadow-green-400/50" : "border-gray-300"} bg-amber-100 flex items-center justify-center text-4xl transition-all`}>
        🧑‍🌾
        {speaking && !paused && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-30" />
            <div className="absolute inset-[-6px] rounded-full border-2 border-green-300 animate-pulse opacity-40" />
          </>
        )}
      </div>
      <div className="flex items-end gap-1 h-5">
        {[3, 5, 7, 5, 3, 6, 4].map((h, i) => (
          <div
            key={i}
            className={`w-1 rounded-full ${speaking && !paused ? "bg-green-400 animate-bounce" : "bg-gray-300"}`}
            style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
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
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setTranslated(null);
    stopSpeaking();
  };

  const handleSubmit = async () => {
    if (!file) return alert(t.selectImage);
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setTranslated(null);
    stopSpeaking();
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict/", formData);
      setResult(res.data);
      setActiveTab("about");
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
    stopSpeaking();
  };

  const stopSpeaking = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setSpeaking(false);
    setPaused(false);
  };

  const speakResult = async () => {
    if (!result) return;
    stopSpeaking();
    setSpeaking(true);
    const text = [
      get("disease") || result.disease.replace(/_/g, " "),
      get("description"), get("solution"),
      get("farmer_tip"), get("homemade_solution"), get("field_manner"),
    ].filter(Boolean).join(". ");
    try {
      const res = await axios.post("http://127.0.0.1:8000/speak", { text, lang }, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "audio/mpeg" }));
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => { setSpeaking(false); setPaused(false); audioRef.current = null; };
      audio.onerror = () => { setSpeaking(false); setPaused(false); };
    } catch {
      setSpeaking(false);
    }
  };

  const togglePause = () => {
    if (!audioRef.current) return;
    if (paused) { audioRef.current.play(); setPaused(false); }
    else { audioRef.current.pause(); setPaused(true); }
  };

  const get = (key) => (translated && translated[key]) ? translated[key] : result?.[key];
  const isHealthy = result?.disease?.toLowerCase().includes("healthy");
  const langLabel = LANGUAGES.find(l => l.code === lang)?.label || "English";

  const tabContent = {
    about: (
      <div className="p-4 bg-blue-50 rounded-2xl text-sm text-gray-700 leading-relaxed min-h-[120px]">
        {get("description")}
      </div>
    ),
    solution: (
      <div className="p-4 bg-yellow-50 rounded-2xl text-sm text-gray-700 leading-relaxed min-h-[120px]">
        {get("solution")}
      </div>
    ),
    medicine: (
      <div className="p-4 bg-purple-50 rounded-2xl min-h-[120px]">
        <div className="flex flex-wrap gap-2">
          {(translated?.medicine || result?.medicine || "").split(",").map((med, i) => (
            <span key={i} className="bg-purple-200 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
              💊 {med.trim()}
            </span>
          ))}
        </div>
      </div>
    ),
    farmer: (
      <div className="p-4 bg-orange-50 rounded-2xl text-sm text-gray-700 leading-relaxed min-h-[120px]">
        {get("farmer_tip")}
      </div>
    ),
    homemade: (
      <div className="p-4 bg-lime-50 rounded-2xl text-sm text-gray-700 leading-relaxed min-h-[120px]">
        {get("homemade_solution")}
      </div>
    ),
    field: (
      <div className="p-4 bg-teal-50 rounded-2xl text-sm text-gray-700 leading-relaxed min-h-[120px]">
        {get("field_manner")}
      </div>
    ),
  };

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
            <select value={lang} onChange={handleLangChange} className="bg-white/20 text-white border border-white/30 rounded-xl px-3 py-1 text-sm focus:outline-none">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code} className="text-black">{l.label}</option>)}
            </select>
            <div className="text-right">
              <p className="text-white text-sm font-semibold">{t.hi} {username}</p>
              <button onClick={onLogout} className="text-red-300 text-xs hover:underline">{t.logout}</button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center py-8 px-4">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">🌿 {t.appName}</h2>
          <p className="text-green-200 mt-2 text-lg">Upload a leaf photo — get instant disease diagnosis & treatment</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-12 space-y-4">

          {/* Upload Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-4 border border-white/60">
            <div className="border-2 border-dashed border-green-300 rounded-2xl p-4 text-center bg-green-50/50">
              <p className="text-4xl mb-2">📷</p>
              <input type="file" accept="image/*" onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200" />
            </div>
            {translating && <p className="text-xs text-green-600 animate-pulse text-center">🌐 {t.translating}</p>}
            {preview && (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full h-52 object-cover rounded-2xl shadow-md" />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">📸 Leaf Preview</div>
              </div>
            )}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-4 rounded-2xl font-extrabold text-lg hover:from-green-600 hover:to-green-800 transition-all disabled:from-gray-400 disabled:to-gray-500 shadow-lg">
              {loading ? `⏳ ${t.analyzing}` : `🔍 ${t.checkHealth}`}
            </button>
          </div>

          {/* Result */}
          {result && !result.error && (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-4 border border-white/60">

              {/* Disease Badge + Voice Assistant side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Disease Badge */}
                <div className={`p-4 rounded-2xl text-center ${isHealthy ? "bg-green-100 border-2 border-green-400" : "bg-red-100 border-2 border-red-400"}`}>
                  <p className="text-3xl mb-1">{isHealthy ? "✅" : "⚠️"}</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">{t.detected}</p>
                  <p className="text-base font-extrabold text-gray-800">{translated?.disease || result.disease.replace(/_/g, " ")}</p>
                  <div className="mt-2 inline-block bg-white rounded-full px-3 py-1 text-xs font-semibold text-gray-600 shadow">
                    {t.confidence} {result.confidence}%
                  </div>
                </div>

                {/* Voice Assistant */}
                <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-4 border border-green-600 flex flex-col items-center justify-between">
                  <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">🎙️ AI Voice</p>
                  <FarmerAvatar speaking={speaking} paused={paused} />
                  <p className="text-white/70 text-xs text-center mt-2">
                    {speaking && !paused ? `🗣️ Speaking...` : paused ? "⏸️ Paused" : langLabel}
                  </p>
                  <div className="flex gap-2 mt-3 w-full">
                    {!speaking ? (
                      <button onClick={speakResult} className="flex-1 bg-green-500 hover:bg-green-400 text-white py-2 rounded-xl text-xs font-bold">▶️ Play</button>
                    ) : (
                      <>
                        <button onClick={togglePause} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-white py-2 rounded-xl text-xs font-bold">
                          {paused ? "▶️" : "⏸️"}
                        </button>
                        <button onClick={stopSpeaking} className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2 rounded-xl text-xs font-bold">⏹️</button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab Buttons — 2 per row */}
              <div className="grid grid-cols-2 gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      activeTab === tab.key
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-white/70 text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {tab.emoji} {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Tab Content */}
              {tabContent[activeTab]}

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
