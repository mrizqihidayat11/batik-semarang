from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[1]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / '.env', extra='ignore')
    cors_origins: list[str] = ['http://localhost:5173', 'http://127.0.0.1:5173']
    model_path: str = ''
    model_framework: str = ''
    input_size: tuple[int, int] | None = None
    dataset_size: int | None = None
    adapter_module: str = 'app.services.colab_adapter'
    class_mapping_path: str = 'app/data/class_mapping.json'
    metrics_path: str = 'evaluation/metrics.json'
    max_upload_mb: int = Field(default=10, ge=1, le=50)

    def resolve(self, path: str) -> Path:
        value = Path(path)
        return value if value.is_absolute() else BASE_DIR / value

settings = Settings()
