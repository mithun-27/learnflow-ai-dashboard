import json
import redis.asyncio as redis
from app.core.config import settings
from typing import Optional, Any

class CacheService:
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)

    async def get(self, key: str) -> Optional[Any]:
        data = await self.redis.get(key)
        return json.loads(data) if data else None

    async def set(self, key: str, value: Any, expire: int = 3600):
        await self.redis.set(key, json.dumps(value), ex=expire)

    async def delete(self, key: str):
        await self.redis.delete(key)

cache = CacheService()
