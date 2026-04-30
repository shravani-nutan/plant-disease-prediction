# 🌾 KisanAI — Plant Disease Detection for Farmers

An AI-powered web app that helps farmers detect plant diseases from leaf images and get treatment solutions in their own language.

---

## 🌿 What It Does

- Upload a leaf photo and get instant disease diagnosis
- Shows disease description, technical solution, suggested medicines
- Farmer's guide in simple language
- Homemade solutions farmers can make at home
- Field management tips
- All content translates into 13 languages
- User signup and login system

---

## 🌐 Supported Languages

English, Hindi, Marathi, Punjabi, Gujarati, Telugu, Tamil, Kannada, Bengali, Urdu, Spanish, French, Arabic

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS + Vite |
| Backend | FastAPI (Python) |
| AI Model | TensorFlow / Keras (CNN) |
| Database | SQLite (via SQLAlchemy) |
| Auth | JWT (python-jose + passlib) |
| Translation | Google Translate (deep-translator) |

---

## 🚀 How to Run

### Backend

```bash
# Create virtual environment with Python 3.10
py -3.10 -m venv venv310

# Install dependencies
venv310\Scripts\python.exe -m pip install fastapi uvicorn python-multipart tensorflow pillow numpy sqlalchemy python-jose passlib bcrypt==4.0.1 deep-translator

# Start the backend server
venv310\Scripts\python.exe -m uvicorn main:app --reload
```

Runs at: `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

---

## 🤖 Model

The trained model (`plant_model.h5`) is not included due to file size. Train it using `project.py` or place it manually in the project root.

### Supported Disease Classes (15 total)

Pepper Bell Bacterial Spot, Pepper Bell Healthy, Potato Early Blight, Potato Late Blight, Potato Healthy, Tomato Bacterial Spot, Tomato Early Blight, Tomato Late Blight, Tomato Leaf Mold, Tomato Septoria Leaf Spot, Tomato Spider Mites, Tomato Target Spot, Tomato Yellow Leaf Curl Virus, Tomato Mosaic Virus, Tomato Healthy

---

## 📁 Project Structure

```
plant_deases_prediction/
├── main.py              # FastAPI backend (auth + predict + translate)
├── project.py           # Model loading, prediction & disease solutions
├── database.py          # SQLite database models
├── auth.py              # JWT auth utilities
├── plant_model.h5       # Trained model (not in repo)
└── frontend/
    └── src/
        ├── components/
        │   ├── Upload.jsx     # Main upload & result page
        │   ├── Login.jsx      # Login page
        │   ├── Signup.jsx     # Signup page
        │   └── Footer.jsx     # Footer component
        ├── LangContext.jsx    # Language context & translations
        └── App.jsx
```

---

## 📬 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and get JWT token |
| POST | `/predict/` | Upload leaf image, get disease prediction |
| POST | `/translate` | Translate content to selected language |
