import { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      // Matches your FastAPI @app.post("/predict/")
      const res = await axios.post("http://127.0.0.1:8000/predict/", formData);
      setResult(res.data.disease ? `${res.data.disease} (${res.data.confidence}% confidence)` : JSON.stringify(res.data));
    } catch (error) {
      console.error("Error:", error);
      setResult("Error: Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Plant Health AI</h1>
        
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-6"
        />

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all disabled:bg-gray-400"
        >
          {loading ? "Analyzing Leaf..." : "Check Health"}
        </button>

        {result && (
          <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <h2 className="text-sm uppercase tracking-widest text-green-600 font-semibold">Result</h2>
            <p className="text-2xl font-bold text-gray-800">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;