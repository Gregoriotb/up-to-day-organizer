import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, Check, X, Move } from 'lucide-react';

/**
 * Modal para recortar y ajustar imágenes con zoom y reposicionamiento
 */
const ImageCropModal = ({ image, onClose, onCropComplete, aspectRatio = 1, cropShape = 'rect' }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /**
   * Callback cuando se completa el crop
   */
  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * Crear imagen recortada
   */
  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error al recortar imagen:', e);
    }
  };

  /**
   * Incrementar zoom
   */
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  /**
   * Decrementar zoom
   */
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkTheme-card rounded-lg shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-darkTheme-border">
          <div className="flex items-center gap-2">
            <Move className="text-primary dark:text-primary-light" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text">
                Ajustar Imagen
              </h3>
              <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">
                Arrastra para reposicionar, usa el slider para hacer zoom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} className="text-neutral-600 dark:text-darkTheme-muted" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative h-[500px] bg-neutral-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-5 bg-neutral-50 dark:bg-darkTheme-bg border-t border-neutral-200 dark:border-darkTheme-border">
          {/* Zoom Slider */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              <ZoomIn size={16} />
              Zoom
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                aria-label="Alejar"
              >
                <ZoomOut size={18} className="text-neutral-600 dark:text-darkTheme-muted" />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-neutral-200 dark:bg-darkTheme-border rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                aria-label="Acercar"
              >
                <ZoomIn size={18} className="text-neutral-600 dark:text-darkTheme-muted" />
              </button>
              <span className="text-sm font-mono text-neutral-600 dark:text-darkTheme-muted min-w-[3rem] text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-outline flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={createCroppedImage}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Función auxiliar para crear la imagen recortada
 */
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Configurar tamaño del canvas
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Dibujar la imagen recortada
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convertir canvas a blob y luego a data URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas está vacío');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    }, 'image/jpeg', 0.95);
  });
};

/**
 * Crear elemento de imagen desde src
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export default ImageCropModal;
