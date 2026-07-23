from fastapi import FastAPI

app = FastAPI(title="NEX")

@app.get("/")
def root():
    return {"project":"NEX","status":"ok"}

@app.get("/api/health")
def health():
    return {"status":"healthy"}

@app.get("/api/state")
def state():
    return {
        "house": {},
        "system": {"status": "healthy"}
    }
