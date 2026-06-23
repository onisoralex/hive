from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model: SentenceTransformer | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    logger.info("Loading BAAI/bge-m3 model...")
    model = SentenceTransformer("BAAI/bge-m3")
    logger.info("Model loaded. Warming up...")
    model.encode(["warmup"], return_dense=True, return_sparse=True)  # avoids a cold-kernel spike on the first real request
    logger.info("Warmup complete. Embedding service ready.")
    yield
    model = None


app = FastAPI(lifespan=lifespan)


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    dense: list[float]
    sparse: dict[str, float]


@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    output = model.encode(
        [req.text],
        return_dense=True,
        return_sparse=True,
    )

    dense_vector = output["dense"][0].tolist()

    raw_sparse = output["sparse"]
    indices = raw_sparse["indices"][0]
    values = raw_sparse["values"][0]
    sparse_vector = {str(int(idx)): float(val) for idx, val in zip(indices, values)}  # indices are numpy floats; int() prevents keys like "101.0"

    return EmbedResponse(dense=dense_vector, sparse=sparse_vector)


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}
