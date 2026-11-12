import json
import logging
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from ..services.metrics_validation import validate_metrics

router = APIRouter(prefix='/api', tags=['Evaluation'])

@router.get('/metrics')
def metrics(request: Request):
    service = request.app.state.model_service
    path = service.settings.resolve(service.settings.metrics_path)
    if not path.exists():
        return {'available': False, 'is_demo': False, 'message': 'Data evaluasi belum tersedia.', 'model': service.info()}
    try:
        data = validate_metrics(json.loads(path.read_text(encoding='utf-8')))
        if data.get('available') and service.classes and data['classes'] != service.classes:
            raise ValueError('Urutan kelas evaluasi berbeda dari mapping training.')
        artifact = path.parent / 'training_curves.png'
        return {**data, 'model': service.info(), 'is_demo': False, 'training_curves_available': artifact.is_file(),
                'keras_confusion_matrix_available': (path.parent / 'confusion_matrix.png').is_file()}
    except (ValueError, TypeError, KeyError, AttributeError) as exc:
        logging.getLogger(__name__).warning('Evaluasi invalid: %s', exc)
        raise HTTPException(422, 'JSON evaluasi tidak valid. Periksa skema, nilai, dan urutan kelas pada log backend.') from exc


@router.get('/evaluation/training-curves')
def training_curves(request: Request):
    settings = request.app.state.model_service.settings
    path = settings.resolve(settings.metrics_path).parent / 'training_curves.png'
    if not path.is_file():
        raise HTTPException(404, 'Gambar grafik training dari Colab belum tersedia.')
    # Hanya satu artefak tetap yang disajikan, bukan seluruh folder evaluasi.
    return FileResponse(path, media_type='image/png', headers={'Cache-Control': 'no-cache'})


@router.get('/evaluation/keras-confusion-matrix')
def keras_confusion_matrix(request: Request):
    settings = request.app.state.model_service.settings
    path = settings.resolve(settings.metrics_path).parent / 'confusion_matrix.png'
    if not path.is_file():
        raise HTTPException(404, 'Gambar confusion matrix Keras dari Colab belum tersedia.')
    return FileResponse(path, media_type='image/png', headers={'Cache-Control': 'no-cache'})
