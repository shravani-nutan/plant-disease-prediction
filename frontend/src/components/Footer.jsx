function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 text-white/70 text-sm py-6 px-4 mt-8">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span>🌾</span> KisanAI
        </div>
        <p className="text-white/50 text-xs">Smart Plant Disease Detection for Farmers</p>
        <p className="text-white/50 text-xs italic mt-1">🙏 Thank you for using KisanAI. We are committed to supporting every farmer.</p>
        <p className="text-white/30 text-xs mt-2">© {new Date().getFullYear()} KisanAI — Helping farmers grow healthier crops</p>
      </div>
    </footer>
  );
}

export default Footer;
