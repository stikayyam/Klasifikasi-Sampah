import base64
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .model import predict_image, load_model_file
from .db import init_db, save_history, fetch_history, clear_history

app = FastAPI(title="Waste Classification API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()
    load_model_file()

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Waste Classification API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        result = predict_image(contents)
        # Persist history (best effort; failure here should not block response)
        try:
            image_data = None
            if contents and file.content_type:
                encoded = base64.b64encode(contents).decode("utf-8")
                image_data = f"data:{file.content_type};base64,{encoded}"
            save_history(file.filename, file.content_type, result, image_data=image_data)
        except Exception as e:
            print(f"Failed to save history: {e}")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    return {"items": fetch_history(limit=limit, offset=offset)}


@app.delete("/history")
async def delete_history():
    clear_history()
    return {"message": "History cleared"}
