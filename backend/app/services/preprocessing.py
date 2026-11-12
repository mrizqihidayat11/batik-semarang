from io import BytesIO
import warnings
from PIL import Image, ImageOps, UnidentifiedImageError

class InvalidImage(ValueError):
    pass

def decode_image(content: bytes) -> Image.Image:
    """Validasi konten gambar, bukan hanya ekstensi/MIME yang dikirim browser."""
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(BytesIO(content)) as image:
                if image.format not in ('JPEG', 'PNG'):
                    raise InvalidImage('Hanya konten gambar JPEG dan PNG yang didukung.')
                # Guard memori sebelum decompress; model preprocessing dilakukan adapter.
                if image.width * image.height > 25_000_000:
                    raise InvalidImage('Resolusi gambar terlalu besar (maksimal 25 megapiksel).')
                image.load()
                return ImageOps.exif_transpose(image).convert('RGB')
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError, Image.DecompressionBombWarning) as exc:
        raise InvalidImage('File rusak atau tidak dapat dibaca sebagai gambar JPEG/PNG.') from exc
