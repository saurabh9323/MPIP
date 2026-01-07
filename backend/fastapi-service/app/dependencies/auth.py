from fastapi import Request, Depends, HTTPException, status
from app.utils.jwt import verify_jwt_token


def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    print(token,"token value in auth dep")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    payload = verify_jwt_token(token)

    return {
        "user_id": payload.get("userId"),
        "role": payload.get("role")
    }
