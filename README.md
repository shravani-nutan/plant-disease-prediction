# Plant Disease Prediction App

Upload a leaf image and the AI will tell you what disease the plant has.

## Tech Used

- Frontend: React + Tailwind CSS + Vite
- Backend: FastAPI (Python)
- AI Model: TensorFlow / Keras

## How to Run

### Backend

```bash
py -3.10 -m venv venv310
venv310\Scripts\python.exe -m pip install fastapi uvicorn python-multipart tensorflow pillow numpy
venv310\Scripts\python.exe -m uvicorn main:app --reload
```

Runs at: http://127.0.0.1:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: http://localhost:5173

## Model

The model file `plant_model.h5` is not included due to its size. Train it using `project.py` or add it manually to the project root.

## Supported Plants

Pepper, Potato, and Tomato — 15 disease categories total.

## API

`POST /predict/` — upload a leaf image, get back disease name and confidence score.

```json
{
  "disease": "Tomato_Early_blight",
  "confidence": 94.73
}
```
