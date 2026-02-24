from fastapi import FastAPI
from .database import engine, Base
from . import models

# Esta linha cria as tabelas no SQLite se elas não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"status": "DevTrackr Online", "database": "Connected"}