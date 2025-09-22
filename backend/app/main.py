from fastapi import FastAPI
from .database import engine, Base
from .routes.auth import router as auth_router
from .routes.users import router as users_router
from .routes.ventures import router as ventures_router
from .routes.resources import router as resources_router
from .routes.applications import router as applications_router
from .routes.milestones import router as milestones_router
from .routes.mentor_matches import router as mentor_matches_router
from .routes.messages import router as messages_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="African Healthpreneurship Hub API")

@app.get("/", summary="Welcome message", description="Returns a welcome message for the African Healthpreneurship Hub API")
def read_root():
    return {"message": "Welcome to the African Healthpreneurship Hub API", "version": "1.0.0", "docs": "/docs", "redoc": "/redoc"}

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(ventures_router)
app.include_router(resources_router)
app.include_router(applications_router)
app.include_router(milestones_router)
app.include_router(mentor_matches_router)
app.include_router(messages_router)