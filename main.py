from fastapi import FastAPI, File, UploadFile
import shutil
import os
from project import predict_disease

app = FastAPI()

UPLOAD_FOLDER = "uploads"

# Create uploads folder if not exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.get("/")
def home():
    return {"message": "Plant Disease Prediction API is running"}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Predict
        result = predict_disease(file_path)

        return result

    except Exception as e:
        return {"error": str(e)}