import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .services.model_service import ModelService
from .routes import predict, metrics

@asynccontextmanager
async def lifespan(app: FastAPI):
    service = ModelService(settings)
    service.load()
    app.state.model_service = service
    app.state.prediction_lock = asyncio.Lock()
    yield
    service.model = None

app = FastAPI(title='Batik Semarang Classification API', version='1.0.0', lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=False,
                   allow_methods=['GET', 'POST'], allow_headers=['Content-Type'])
app.include_router(predict.router)
app.include_router(metrics.router)

@app.get('/api/health', tags=['System'])
def health():
    service = app.state.model_service
    return {'status': 'ok', 'model_connected': service.connected, 'message': service.status, 'model': service.info()}

@app.get('/api/classes', tags=['System'])
def classes():
    service = app.state.model_service
    return {'available': bool(service.classes), 'classes': service.classes,
            'message': 'Urutan output model dari training.' if service.classes else 'Mapping training belum tersedia.'}
