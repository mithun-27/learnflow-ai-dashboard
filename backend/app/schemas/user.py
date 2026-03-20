from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
