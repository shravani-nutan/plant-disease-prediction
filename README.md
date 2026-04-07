# 🌿 Plant Disease Prediction App

An AI-powered web app that detects plant diseases from leaf images. Upload a photo of a leaf and get instant disease diagnosis with confidence score.

---

## 🖼️ What It Does

- Upload a leaf image from your device
- AI model analyzes the image
- Returns the disease name and confidence percentage
- Supports 15 plant disease categories across Pepper, Potato, and Tomato plants

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS + Vite |
| Backend | FastAPI (Python) |
| AI Model | TensorFlow / Keras (CNN) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10
- Node.js 18+
- `plant_model.h5` model file (not included — see below)

---

### Backend Setup

```bash
# Create virtual environment with Python 3.10
py -3.10 -m venv venv310

# Install dependencies
venv310\Scripts\python.exe -m pip install fastapi uvicorn python-multipart tensorflow pillow numpy

# Start the backend server
venv310\Scripts\python.exe -m uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`  
API docs at: `http://127.0.0.1:8000/docs`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🤖 Model

The trained model (`plant_model.h5`) is not included in this repo due to file size.

To get the model:
- Train it yourself using `project.py`
- Or download it separately and place it in the **project root** folder

### Supported Disease Classes

| # | Class |
|---|-------|
| 1 | Pepper Bell - Bacterial Spot |
| 2 | Pepper Bell - Healthy |
| 3 | Potato - Early Blight |
| 4 | Potato - Late Blight |
| 5 | Potato - Healthy |
| 6 | Tomato - Bacterial Spot |
| 7 | Tomato - Early Blight |
| 8 | Tomato - Late Blight |
| 9 | Tomato - Leaf Mold |
| 10 | Tomato - Septoria Leaf Spot |
| 11 | Tomato - Spider Mites |
| 12 | Tomato - Target Spot |
| 13 | Tomato - Yellow Leaf Curl Virus |
| 14 | Tomato - Mosaic Virus |
| 15 | Tomato - Healthy |

---

## 📁 Project Structure

```
plant_deases_prediction/
├── main.py              # FastAPI backend
├── project.py           # Model loading & prediction logic
├── plant_model.h5       # Trained model (not in repo)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Upload.jsx   # Main upload UI component
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 📬 API Endpoint

### `POST /predict/`

Upload a leaf image and get a prediction.

**Request:** `multipart/form-data` with a `file` field  
**Response:**
```json
{
  "disease": "Tomato_Early_blight",
  "confidence": 94.73
}
```
