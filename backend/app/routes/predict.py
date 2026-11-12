import logging
from time import perf_counter
from fastapi import APIRouter, File, UploadFile, Request, HTTPException
from starlette.concurrency import run_in_threadpool
from ..schemas.prediction import PredictionResponse
from ..services.preprocessing import InvalidImage

router = APIRouter(prefix='/api', tags=['Prediction'])
logger = logging.getLogger(__name__)

@router.post('/predict', response_model=PredictionResponse)
async def predict(request: Request, file: UploadFile = File(...)):
    service = request.app.state.model_service
    try:
        if file.content_type not in ('image/jpeg', 'image/png'):
            raise HTTPException(415, 'Format file harus JPEG atau PNG.')
        limit = service.settings.max_upload_mb * 1024 * 1024
        content = await file.read(limit + 1)
        if not content:
            raise HTTPException(400, 'File gambar kosong.')
        if len(content) > limit:
            raise HTTPException(413, f'Ukuran file maksimal {service.settings.max_upload_mb} MB.')
        if not service.connected:
            raise HTTPException(503, service.status)
        started = perf_counter()
        # Lock menjaga adapter framework yang belum dipastikan thread-safe.
        async with request.app.state.prediction_lock:
            predictions = await run_in_threadpool(service.predict, content)
        return PredictionResponse(predicted_class=predictions[0]['class_name'], confidence=predictions[0]['confidence'],
                                  predictions=predictions[:3], processing_time=round(perf_counter() - started, 4))
    except InvalidImage as exc:
        raise HTTPException(400, str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception('Inference gagal')
        raise HTTPException(500, 'Inference gagal. Periksa preprocessing, model, dan mapping kelas pada log backend.') from exc
    finally:
        await file.close()
