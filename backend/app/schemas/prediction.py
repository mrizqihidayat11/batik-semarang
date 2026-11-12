from pydantic import BaseModel, Field

class ClassPrediction(BaseModel):
    class_name: str
    confidence: float = Field(ge=0, le=1)

class PredictionResponse(BaseModel):
    success: bool = True
    predicted_class: str
    confidence: float = Field(ge=0, le=1)
    predictions: list[ClassPrediction]
    processing_time: float = Field(ge=0)
    is_demo: bool = False
