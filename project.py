import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists("plant_model.h5"):
            raise RuntimeError("Model file 'plant_model.h5' not found.")
        _model = load_model("plant_model.h5")
    return _model

disease_solutions = {
    "Pepper__bell___Bacterial_spot": {
        "description": "Bacterial spot causes dark, water-soaked lesions on leaves and fruits.",
        "solution": "Apply copper-based bactericides. Remove infected leaves. Avoid overhead watering. Use disease-free seeds.",
        "farmer_tip": "Spray neem water or copper sulfate solution early morning. Do not water from above — use drip or pour at the base. Pull out badly infected plants before it spreads to neighbors.",
        "homemade_solution": "Mix 1 tablespoon of baking soda + 1 teaspoon of neem oil + 1 liter of water. Spray on leaves every 5 days.",
        "medicine": "Copper Oxychloride (Blitox), Streptomycin Sulphate, Mancozeb (Dithane M-45)",
        "field_manner": "Always water at the base of the plant. Remove infected leaves and burn them away from the field. Maintain 30-40 cm gap between plants. Rotate crops every season."
    },
    "Pepper__bell___healthy": {
        "description": "Your pepper plant looks healthy!",
        "solution": "Keep up regular watering, fertilizing, and monitoring for pests.",
        "farmer_tip": "Water your pepper every 2-3 days. Add compost or cow dung manure once a month. Check leaves weekly for any spots or insects.",
        "homemade_solution": "Mix cow dung compost with soil around the base once a month to keep the plant strong.",
        "medicine": "No medicine needed. Use NPK fertilizer (19:19:19) for healthy growth.",
        "field_manner": "Keep field clean of weeds. Water regularly at the base. Add organic compost every 3-4 weeks."
    },
    "Potato___Early_blight": {
        "description": "Early blight causes dark brown spots with concentric rings on older leaves.",
        "solution": "Apply fungicides like chlorothalonil or mancozeb. Remove infected leaves. Ensure proper spacing for airflow.",
        "farmer_tip": "Remove yellow or spotted leaves by hand and burn them. Spray mancozeb every 10 days. Plant potatoes with enough gap between rows so air can pass through.",
        "homemade_solution": "Boil 100g of garlic in 1 liter of water, cool it, and spray on plants. Also mix wood ash in water and spray on leaves.",
        "medicine": "Mancozeb (Dithane M-45), Chlorothalonil (Kavach), Iprodione (Rovral)",
        "field_manner": "Plant rows 60 cm apart. Remove lower leaves touching the soil. After harvest, remove all plant debris from the field. Do not plant potatoes in the same field two years in a row."
    },
    "Potato___Late_blight": {
        "description": "Late blight causes water-soaked lesions that turn brown and kill the plant rapidly.",
        "solution": "Apply fungicides immediately. Remove and destroy infected plants. Avoid wet conditions. Use resistant varieties.",
        "farmer_tip": "This disease spreads very fast in rain. If you see brown patches, act the same day. Uproot and burn infected plants away from the field. Spray Ridomil or Dithane M-45 immediately.",
        "homemade_solution": "Spray Bordeaux mixture: mix 100g copper sulfate + 100g lime in 10 liters of water. Apply every 7 days during rainy season.",
        "medicine": "Metalaxyl + Mancozeb (Ridomil Gold), Cymoxanil + Mancozeb (Curzate), Dimethomorph (Acrobat)",
        "field_manner": "Avoid planting in low-lying waterlogged areas. Use raised beds. Do not plant potatoes near tomatoes. Spray preventively before rainy season starts."
    },
    "Potato___healthy": {
        "description": "Your potato plant looks healthy!",
        "solution": "Maintain proper irrigation and monitor regularly for early signs of disease.",
        "farmer_tip": "Water regularly but do not flood the field. Add potash fertilizer to strengthen the plant. Check every few days especially during rainy season.",
        "homemade_solution": "Add wood ash around the base of plants — it provides potassium and keeps pests away.",
        "medicine": "No medicine needed. Use potash (MOP) fertilizer for strong tuber development.",
        "field_manner": "Earth up soil around plants when they are 20 cm tall. Keep field weed-free. Water every 3-4 days depending on weather."
    },
    "Tomato_Bacterial_spot": {
        "description": "Bacterial spot causes small, dark, water-soaked spots on leaves and fruits.",
        "solution": "Use copper-based sprays. Remove infected plant parts. Avoid working with wet plants.",
        "farmer_tip": "Spray Bordeaux mixture on the plants. Do not touch plants when they are wet — bacteria spreads through hands and tools. Wash your tools with soap water before moving to another row.",
        "homemade_solution": "Bordeaux mixture: dissolve 100g copper sulfate in 5 liters of water, add 100g lime in another 5 liters, then mix both. Spray every 10 days.",
        "medicine": "Copper Hydroxide (Kocide), Streptomycin + Tetracycline (Paushamycin), Copper Oxychloride",
        "field_manner": "Avoid overhead irrigation. Use drip irrigation. Do not work in the field when plants are wet. Disinfect tools with bleach solution between uses."
    },
    "Tomato_Early_blight": {
        "description": "Early blight causes dark spots with yellow rings on lower leaves.",
        "solution": "Apply fungicides like mancozeb. Remove lower infected leaves. Mulch around plants to prevent soil splash.",
        "farmer_tip": "Remove the bottom leaves touching the soil. Put dry grass or straw around the base of the plant to stop mud from splashing up. Spray mancozeb every 7-10 days during humid weather.",
        "homemade_solution": "Mix 2 tablespoons of neem oil + 1 teaspoon of dish soap in 1 liter of water. Spray on all leaf surfaces every week.",
        "medicine": "Mancozeb (Dithane M-45), Azoxystrobin (Amistar), Tebuconazole (Folicur)",
        "field_manner": "Mulch the base with straw or dry leaves. Remove lower leaves when plant is 30 cm tall. Water only at the base. Space plants 45-60 cm apart."
    },
    "Tomato_Late_blight": {
        "description": "Late blight causes large, greasy-looking lesions on leaves and stems.",
        "solution": "Apply fungicides immediately. Destroy infected plants. Avoid overhead irrigation.",
        "farmer_tip": "Do not delay — uproot and burn infected plants the same day. Water at the base only, never from above. Avoid planting tomatoes near potatoes as both can share this disease.",
        "homemade_solution": "Spray Bordeaux mixture (copper sulfate + lime in water) every 7 days as a preventive measure during rainy season.",
        "medicine": "Metalaxyl + Mancozeb (Ridomil Gold), Fenamidone + Mancozeb (Sectin), Cymoxanil (Curzate)",
        "field_manner": "Never plant tomatoes and potatoes in adjacent fields. Use raised beds for better drainage. Remove all crop debris after harvest. Spray fungicide before monsoon season."
    },
    "Tomato_Leaf_Mold": {
        "description": "Leaf mold causes yellow patches on upper leaf surface and olive-green mold below.",
        "solution": "Improve ventilation. Apply fungicides. Reduce humidity in greenhouses. Remove infected leaves.",
        "farmer_tip": "This disease loves humid and closed spaces. If growing in a greenhouse, open vents daily. Remove crowded branches so air flows freely. Avoid wetting leaves while watering.",
        "homemade_solution": "Mix 1 tablespoon of baking soda + 1 teaspoon of soap in 1 liter of water. Spray on the underside of leaves every 5-7 days.",
        "medicine": "Carbendazim (Bavistin), Chlorothalonil (Kavach), Difenoconazole (Score)",
        "field_manner": "Prune lower and inner branches to improve airflow. Keep humidity below 85%. Water in the morning so leaves dry during the day. Space plants well apart."
    },
    "Tomato_Septoria_leaf_spot": {
        "description": "Septoria causes small circular spots with dark borders and light centers.",
        "solution": "Apply fungicides. Remove infected leaves. Avoid wetting foliage. Rotate crops yearly.",
        "farmer_tip": "Pick off spotted leaves and put them in a bag — do not throw in the field. Spray chlorothalonil or mancozeb. Next year, grow a different crop in the same spot to break the disease cycle.",
        "homemade_solution": "Spray garlic extract: crush 10 garlic cloves, soak in 1 liter of water overnight, strain and spray on plants every 5 days.",
        "medicine": "Chlorothalonil (Kavach), Mancozeb (Dithane M-45), Copper Oxychloride (Blitox)",
        "field_manner": "Rotate crops — do not grow tomatoes in the same field for 2-3 years. Remove all plant debris after harvest. Mulch the soil to prevent spore splash from soil to leaves."
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "description": "Spider mites cause yellowing, stippling, and webbing on leaves.",
        "solution": "Apply miticides or neem oil. Increase humidity. Remove heavily infested leaves. Introduce predatory mites.",
        "farmer_tip": "Mix neem oil with water and soap and spray on the underside of leaves where mites hide. Spider mites love dry and dusty conditions — water the area around plants to increase moisture.",
        "homemade_solution": "Mix 2 tablespoons of neem oil + 1 teaspoon of liquid soap in 1 liter of water. Spray under leaves every 3-4 days. Also spray plain water under leaves to wash mites off.",
        "medicine": "Abamectin (Vertimec), Spiromesifen (Oberon), Dicofol (Kelthane), Neem-based pesticide (Neemix)",
        "field_manner": "Keep field moist — mites thrive in dry conditions. Remove heavily infested leaves immediately. Avoid excessive use of nitrogen fertilizer as it attracts mites. Check underside of leaves regularly."
    },
    "Tomato__Target_Spot": {
        "description": "Target spot causes brown lesions with concentric rings resembling a target.",
        "solution": "Apply fungicides. Improve air circulation. Remove infected plant debris. Avoid overhead watering.",
        "farmer_tip": "Clear all dead leaves and plant waste from the field — the fungus lives in old debris. Spray mancozeb or azoxystrobin. Give plants more space when planting next time so air can circulate.",
        "homemade_solution": "Spray a mixture of 1 tablespoon turmeric powder + 1 teaspoon neem oil + 1 liter of water on affected plants every week.",
        "medicine": "Azoxystrobin (Amistar), Mancozeb (Dithane M-45), Boscalid + Pyraclostrobin (Bellis)",
        "field_manner": "Space plants 50-60 cm apart. Remove all crop debris after harvest and burn it. Avoid overhead irrigation. Stake plants to keep them off the ground."
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "description": "Yellow leaf curl virus causes yellowing, curling, and stunted growth.",
        "solution": "Control whitefly vectors with insecticides. Remove infected plants. Use virus-resistant varieties.",
        "farmer_tip": "This virus is spread by tiny white insects called whiteflies. Spray imidacloprid or use yellow sticky traps to catch them. Uproot and burn infected plants — there is no cure once infected.",
        "homemade_solution": "Hang yellow sticky traps (yellow cardboard coated with grease or oil) in the field to catch whiteflies. Spray neem oil solution weekly as a repellent.",
        "medicine": "Imidacloprid (Confidor), Thiamethoxam (Actara), Acetamiprid (Mospilan)",
        "field_manner": "Use insect-proof nets around seedling nurseries. Remove and burn infected plants immediately. Plant resistant varieties like Arka Rakshak or Pusa Rohini. Avoid planting near other infected crops."
    },
    "Tomato__Tomato_mosaic_virus": {
        "description": "Mosaic virus causes mottled yellow-green patterns and distorted leaves.",
        "solution": "Remove and destroy infected plants. Wash hands and tools. Control aphids. Use resistant varieties.",
        "farmer_tip": "Wash your hands with soap before touching plants — this virus spreads through touch. Remove infected plants and burn them. Control aphids by spraying neem oil. Do not smoke near tomato plants.",
        "homemade_solution": "Spray neem oil solution (2 tablespoons per liter of water with soap) to control aphids that spread the virus. Wash hands with soap before entering the field.",
        "medicine": "No direct cure. Control aphids with Imidacloprid (Confidor) or Dimethoate (Rogor). Use virus-free certified seeds.",
        "field_manner": "Never use tobacco near tomato plants. Disinfect all tools with bleach before use. Remove weeds that can harbor the virus. Use certified disease-free seeds every season."
    },
    "Tomato_healthy": {
        "description": "Your tomato plant looks healthy!",
        "solution": "Keep up regular watering, fertilizing, and monitoring for pests.",
        "farmer_tip": "Water at the base every 2 days. Add DAP or urea fertilizer once every 3 weeks. Tie tall plants to sticks so they don't fall. Check leaves every few days for early signs of spots or insects.",
        "homemade_solution": "Mix cow dung + water (1:10 ratio) and pour around the base of plants once a week as a natural fertilizer.",
        "medicine": "No medicine needed. Use NPK (12:32:16) at planting and urea at 30 days for healthy growth.",
        "field_manner": "Stake plants when 30 cm tall. Water every 2 days at the base. Weed the field every 2 weeks. Apply mulch to retain moisture and prevent weeds."
    }
}

class_names = [
    "Pepper__bell___Bacterial_spot",   # 0
    "Pepper__bell___healthy",           # 1
    "PlantVillage",                     # 2
    "Potato___Early_blight",            # 3
    "Potato___Late_blight",             # 4
    "Potato___healthy",                 # 5
    "Tomato_Bacterial_spot",            # 6
    "Tomato_Early_blight",              # 7
    "Tomato_Late_blight",               # 8
    "Tomato_Leaf_Mold",                 # 9
    "Tomato_Septoria_leaf_spot",        # 10
    "Tomato_Spider_mites_Two_spotted_spider_mite", # 11
    "Tomato__Target_Spot",              # 12
    "Tomato__Tomato_YellowLeaf__Curl_Virus", # 13
    "Tomato__Tomato_mosaic_virus",      # 14
    "Tomato_healthy"                    # 15
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

        if confidence < 0.5 or predicted_class == "PlantVillage":
            return {
                "disease": "Unknown",
                "confidence": round(confidence * 100, 2),
                "description": "The model could not confidently identify this image. Please upload a clear photo of a plant leaf.",
                "solution": "Make sure the image shows only the leaf clearly with good lighting.",
                "farmer_tip": "Take a close-up photo of the affected leaf in daylight. Avoid blurry or dark images.",
                "homemade_solution": "N/A",
                "medicine": "N/A",
                "field_manner": "N/A"
            }

        return {
            "disease": predicted_class,
            "confidence": round(confidence * 100, 2),
            "description": disease_solutions.get(predicted_class, {}).get("description", ""),
            "solution": disease_solutions.get(predicted_class, {}).get("solution", ""),
            "farmer_tip": disease_solutions.get(predicted_class, {}).get("farmer_tip", ""),
            "homemade_solution": disease_solutions.get(predicted_class, {}).get("homemade_solution", ""),
            "medicine": disease_solutions.get(predicted_class, {}).get("medicine", ""),
            "field_manner": disease_solutions.get(predicted_class, {}).get("field_manner", "")
        }

    except Exception as e:
        return {"error": str(e)}
