from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


def ip_and_email_key(request: Request) -> str:
    ip = get_remote_address(request) or "127.0.0.1"
    return ip


limiter = Limiter(key_func=ip_and_email_key, enabled=True, swallow_errors=True)
