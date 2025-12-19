"""
Supabase Auth middleware for FastAPI.

This module provides JWT token validation for Supabase Auth.
It extracts the user from the Authorization header and validates
the JWT against Supabase's public keys.
"""

import os
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt

from .database import get_db
from .models import User

# Security scheme for Swagger UI
security = HTTPBearer(auto_error=False)

# Supabase JWT settings
# The JWT secret can be found in Supabase Dashboard -> Settings -> API -> JWT Secret
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")

# For local development/testing, fall back to single-user mode
ENABLE_AUTH = bool(SUPABASE_JWT_SECRET)


def decode_jwt(token: str) -> dict:
    """Decode and verify a Supabase JWT token."""
    if not SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth not configured: SUPABASE_JWT_SECRET missing"
        )

    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency that extracts and validates the current user.

    In production (ENABLE_AUTH=True):
      - Requires valid Bearer token
      - Creates user in DB if not exists (first-login auto-provisioning)

    In development (ENABLE_AUTH=False):
      - Falls back to user ID 1 for local testing
    """
    # Development mode fallback - NOT RECOMMENDED FOR PRODUCTION
    if not ENABLE_AUTH:
        # Check for a dedicated dev user in the env, else use the first user
        dev_user_id = int(os.environ.get("DEV_USER_ID", 1))
        user = db.query(User).filter(User.id == dev_user_id).first()
        if not user:
            # Auto-create if not exists (wrapped in try/except for safety)
            try:
                user = User(id=dev_user_id, username=f"dev_user_{dev_user_id}")
                db.add(user)
                db.commit()
                db.refresh(user)
            except Exception:
                # Rollback on any error (e.g., FK violation, race condition)
                db.rollback()
                # Try to fetch again in case of race condition
                user = db.query(User).filter(User.id == dev_user_id).first()
                if not user:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to create dev user"
                    )
        return user

    # Production mode - require valid token
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_jwt(credentials.credentials)

    # Extract user info from Supabase JWT
    # Supabase puts user ID in 'sub' claim
    supabase_user_id = payload.get("sub")

    if not supabase_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: no user ID"
        )

    # Find or create user in our database
    # We use supabase_user_id as a unique identifier
    user = db.query(User).filter(User.username == supabase_user_id).first()

    if not user:
        # First login - create user record (with race condition protection)
        try:
            user = User(
                username=supabase_user_id,
                xp=0,
                level=1,
                streak=0,
                current_week=1
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()
            # Race condition: another request created the user
            user = db.query(User).filter(User.username == supabase_user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create user"
                )

    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Optional auth dependency for endpoints that work with or without auth.
    Returns None if no valid token is provided.
    """
    if not credentials:
        if not ENABLE_AUTH:
            # Dev mode - return default user
            return db.query(User).filter(User.id == 1).first()
        return None

    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None
