from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import ALGORITHM
from app.database.session import get_db
from app.models.user import User
from sqlalchemy import select

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user
    
from app.schemas.user import UserCreate, User as UserSchema, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm

@router.post("/register", response_model=UserSchema)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: Registering user {user_in.username}")
    result = await db.execute(select(User).where((User.email == user_in.email) | (User.username == user_in.username)))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email or username already exists")
    
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # Allow login by username or email
    result = await db.execute(select(User).where((User.email == form_data.username) | (User.username == form_data.username)))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username/email or password")
    
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}
