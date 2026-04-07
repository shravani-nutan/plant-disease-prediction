import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load your trained classifier lazily
_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists("plant_model.h5"):
            raise RuntimeError("Model file 'plant_model.h5' not found.")
        _model = load_model("plant_model.h5")
    return _model

class_names = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

def predict_disease(img_path):
    try:
        model = get_model()
        img = image.load_img(img_path, target_size=(128, 128))
        x = image.img_to_array(img) / 255.0
        x = np.expand_dims(x, axis=0)

        prediction = model.predict(x)
        predicted_class = class_names[np.argmax(prediction)]
        confidence = float(np.max(prediction))

        return {
            "disease": predicted_class,
            "confidence": round(confidence * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}