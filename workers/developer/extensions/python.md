# Developer Extension: Python

This extension is included when a task involves Python. It supplements the base Developer instructions for the Python context.

---

## When Python Is Used

Default to Node.js/TypeScript. Switch to Python only when the task involves one of these:

- AI/ML pipelines (embeddings, vector operations, fine-tuning, model evaluation)
- llama.cpp / local LLM integration via HTTP
- Qdrant operations (indexing, querying, payload management)
- Data scraping and extraction pipelines
- Heavy batch processing or data transformation
- Tasks where Python's AI/data science ecosystem (numpy, pandas, transformers, etc.) provides clear advantage

For web APIs, SaaS products, and standard backends, the answer is Node.js. Never mix both languages in the same service.

---

## Project Structure

```
src/
  main.py           # entrypoint
  api/              # FastAPI routes (if this service has an HTTP interface)
  services/         # business logic
  models/           # Pydantic data models
  utils/            # pure helpers
requirements.txt    # pinned dependencies (exact versions)
.env                # environment variables (never committed)
Dockerfile          # always present — Docker is the runtime
```

---

## Code Conventions

- **Type hints everywhere.** All function signatures must have parameter and return type annotations. No bare `def foo(x):`.
- **Pydantic models** for all data crossing service boundaries — function parameters that come from outside, API request/response bodies, config.
- **FastAPI** for any service that exposes an HTTP API. Not Flask, not raw WSGI.
- **`httpx`** for async HTTP calls. Not `requests`.
- Format with `black`. Lint with `ruff`. Both should be in `requirements.txt` as dev dependencies.

---

## Dependency Management

- Use `requirements.txt` with exact pinned versions (`package==1.2.3`, not `package>=1.2`).
- Dev dependencies (black, ruff, pytest, httpx for testing) go in `requirements-dev.txt`.
- Never assume the user has Python installed locally. Docker is the runtime for all Python services.

---

## Docker Integration

- Every Python service has a `Dockerfile`.
- Use a multi-stage build when the image would otherwise be large.
- Python services expose their API on an internal port. The Node.js gateway handles external routing — Python services are internal.
- Never bake model files into Docker images. Mount them as volumes.

---

## llama.cpp Integration

llama.cpp runs as a separate Docker container in server mode. Communicate with it via its HTTP API only.

```python
import httpx

async def generate(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://llama-cpp:8080/completion",
            json={"prompt": prompt, "n_predict": 256}
        )
        return response.json()["content"]
```

- Do not call llama.cpp binaries directly from Python code.
- The llama.cpp service URL is injected via environment variable (`LLAMA_CPP_URL`).

---

## Qdrant Integration

- Use the official `qdrant-client` Python package.
- Qdrant connection URL from environment variable (`QDRANT_URL`).
- The payload is a first-class citizen. Store source text, metadata, and chunk reconstruction data in the payload alongside the vector. Do not treat payload as debug-only.

**Chunk reconstruction pattern:**
When chunking a large text, store the full reconstructed text (or the authoritative summary) in the payload of each chunk, not just a reference ID. At retrieval time, read from payload — do not re-summarize. This guarantees consistency: the same text is returned every time regardless of source availability.

```python
# Storing chunk with reconstruction payload
client.upsert(
    collection_name="documents",
    points=[
        PointStruct(
            id=chunk_id,
            vector=embedding,
            payload={
                "doc_id": doc_id,
                "chunk_index": i,
                "chunk_text": chunk_text,
                "full_summary": authoritative_summary,  # reconstruction anchor
                "source_url": source_url,
                "metadata": {...}
            }
        )
    ]
)
```

---

## Testing

- Use `pytest`.
- Unit test pure functions. Integration test API endpoints with `httpx` (async) in tests.
- Test files mirror source structure: `tests/test_services.py` for `src/services/`.
