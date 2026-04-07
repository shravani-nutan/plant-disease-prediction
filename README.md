# Plant Disease Prediction API

A FastAPI app that predicts plant diseases from leaf images using a trained Keras model.

## Setup

1. Clone the repo
2. Create a virtual environment with Python 3.10:
   ```bash
   py -3.10 -m venv venv310
   venv310\Scripts\python.exe -m pip install fastapi uvicorn python-multipart pillow tensorflow numpy
   ```
3. Download the trained model `plant_model.h5` and place it in the project root.

## Run

```bash
venv310\Scripts\python.exe -m uvicorn main:app --reload
```

API will be available at `http://127.0.0.1:8000/docs`

## Model

The model (`plant_model.h5`) is not included in the repo due to file size. Train it using `project.py` or download it separately.
