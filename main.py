from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from sqlalchemy.orm import Session
import shutil
import os

from project import predict_disease
from database import Base, engine, get_db, User
from auth import hash_password, verify_password, create_access_token
from deep_translator import GoogleTranslator

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def home():
    return {"message": "Plant Disease Prediction API is running"}


@app.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = User(username=data.username, email=data.email, hashed_password=hash_password(data.password))
    db.add(user)
    db.commit()
    return {"message": "Account created successfully"}


@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email, "username": user.username})
    return {"token": token, "username": user.username}


class TranslateRequest(BaseModel):
    texts: dict
    target_lang: str

@app.post("/translate")
def translate(data: TranslateRequest):
    try:
        result = {}
        for key, val in data.texts.items():
            try:
                translated = GoogleTranslator(source="en", target=data.target_lang).translate(val)
                result[key] = translated if translated else val
            except Exception:
                result[key] = val
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = predict_disease(file_path)
        os.remove(file_path)
        return result
    except Exception as e:
        return {"error": str(e)}
