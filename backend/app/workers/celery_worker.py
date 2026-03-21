from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "xynova_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.task_routes = {
    "*": {"queue": "zynova_queue"}
}

celery_app.autodiscover_tasks(["app.workers"])
