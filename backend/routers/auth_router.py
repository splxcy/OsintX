from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from db_models import User
from auth import hash_password, verify_password, create_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str

@router.post("/register", response_model=TokenOut)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    if len(body.password) < 8: raise HTTPException(400, "Contrasena debe tener minimo 8 caracteres")
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(400, "Email ya registrado")
    u = User(email=body.email, hashed_password=hash_password(body.password))
    db.add(u); db.commit(); db.refresh(u)
    return TokenOut(access_token=create_token(u.id), email=u.email)

@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == form.username).first()
    if not u or not verify_password(form.password, u.hashed_password):
        raise HTTPException(401, "Credenciales invalidas")
    return TokenOut(access_token=create_token(u.id), email=u.email)

@router.get("/me")
def me(user = Depends(get_current_user)):
    return {"id": user.id, "email": user.email}
