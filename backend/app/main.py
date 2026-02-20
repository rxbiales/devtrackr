from fastapi import FastAPI

# Esta linha é a que o Uvicorn está procurando!
app = FastAPI() 

@app.get("/")
def home():
    return {"status": "DevTrackr Online", "versao": "1.0"}