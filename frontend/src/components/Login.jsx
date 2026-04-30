import { useState } from "react";
import axios from "axios";
import { useLang, LANGUAGES } from "../LangContext";
import Footer from "./Footer";

const BG = "https://png.pngtree.com/thumb_back/fh260/background/20240704/pngtree-view-of-an-agriculturally-used-field-with-green-grass-image_15859062.jpg";

function Login({ onSwitch, onLogin }) {
  const { lang, setLang, t } = useLang();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      onLogin(res.data.username);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🌾</div>
          <h1 className="text-4xl font-extrabold text-white drop-shadow">KisanAI</h1>
          <p className="text-green-300 text-sm mt-1 font-medium">Smart Plant Disease Detection for Farmers</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{t.welcomeBack}</h2>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-xl px-3 py-1 text-sm focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-black">{l.label}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder={t.email}
              required
              className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder={t.password}
              required
              className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all disabled:bg-gray-500 shadow-lg"
            >
              {loading ? t.loggingIn : t.login}
            </button>
          </form>

          <p className="text-center text-sm text-white/70 mt-4">
            {t.noAccount}{" "}
            <button onClick={onSwitch} className="text-green-300 font-semibold hover:underline">
              {t.signUp}
            </button>
          </p>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">🌱 Helping farmers grow healthier crops</p>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
