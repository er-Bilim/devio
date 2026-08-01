from fastapi import Response

from app.config import settings

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"
REFRESH_PATH = "/auth"


def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE,
        value=access,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * settings.access_token_expire_minutes,
        path="/",
    )
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=refresh,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * 60 * 24 * settings.refresh_token_expire_days,
        path=REFRESH_PATH,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key=ACCESS_COOKIE, path="/")
    response.delete_cookie(key=REFRESH_COOKIE, path=REFRESH_PATH)
