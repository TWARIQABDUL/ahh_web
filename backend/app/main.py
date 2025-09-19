from fastapi import FastAPI
from .database import engine, Base
from .routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="African Healthpreneurship Hub API")

@app.get("/", summary="Welcome message", description="Returns a welcome message for the African Healthpreneurship Hub API")
def read_root():
    return {"message": "Welcome to the African Healthpreneurship Hub API", "version": "1.0.0", "docs": "/docs", "redoc": "/redoc"}

app.include_router(auth_router)