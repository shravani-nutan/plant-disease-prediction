import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load trained model
model = load_model("plant_model.h5")

# Class labels (CHANGE based on your dataset)
class_names = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___healthy",
    "Corn___Cercospora_leaf_spot",
    "Corn___healthy"
    # add all your classes here
]

def predict_disease(img_path):
    try:
        # Load and preprocess image
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        # Prediction
        prediction = model.predict(img_array)
        predicted_class = class_names[np.argmax(prediction)]
        confidence = float(np.max(prediction))

        return {
            "disease": predicted_class,
            "confidence": round(confidence * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}