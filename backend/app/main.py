from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from .routes.auth import router as auth_router
from .routes.users import router as users_router
from .routes.ventures import router as ventures_router
from .routes.resources import router as resources_router
from .routes.applications import router as applications_router
from .routes.milestones import router as milestones_router
from .routes.mentor_matches import router as mentor_matches_router
from .routes.messages import router as messages_router
from .routes.programs import router as programs_router
from .routes.admin import router as admin_router
from .routes.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="African Healthpreneurship Hub API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174","https://ahh-web-beryl.vercel.app"],  # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

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
app.include_router(programs_router)
app.include_router(admin_router)
app.include_router(dashboard_router)