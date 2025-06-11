import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageFile: File) => void;
  imageFile: File | null;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const MIN_CROP_SIZE = 200; // pixels

const ImageCropper = ({ isOpen, onClose, onCropComplete, imageFile }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setRotation(0);
      setPreviewUrl('');
    }
  }, [isOpen]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Criar crop circular centrado com tamanho mínimo
    const cropSize = Math.min(width, height) * 0.8; // 80% do menor lado
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          width: Math.max(cropSize, MIN_CROP_SIZE),
        },
        1, // aspect ratio 1:1 para círculo
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(crop);
  }, []);

  // Quando um arquivo é selecionado, criar URL para preview
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const getCroppedImg = useCallback(async (canvas: HTMLCanvasElement, crop: PixelCrop, scale = 1, rotate = 0) => {
    if (!imgRef.current) return;

    const image = imgRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to the crop size
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.imageSmoothingQuality = 'high';
    ctx.imageSmoothingEnabled = true;

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      crop.width / 2,
      crop.height / 2,
      Math.min(crop.width, crop.height) / 2,
      0,
      2 * Math.PI
    );
    ctx.clip();

    // Rotate and scale
    ctx.translate(crop.width / 2, crop.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-crop.width / 2, -crop.height / 2);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    ctx.restore();

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'avatar.png', { type: 'image/png' });
          resolve(file);
        }
      }, 'image/png', 1.0); // Máxima qualidade
    });
  }, []);

  // Atualizar preview quando crop, zoom ou rotação mudar
  useEffect(() => {
    if (completedCrop && previewCanvasRef.current) {
      getCroppedImg(previewCanvasRef.current, completedCrop, zoom, rotation)
        .then(() => {
          setPreviewUrl(previewCanvasRef.current?.toDataURL() || '');
        });
    }
  }, [completedCrop, zoom, rotation, getCroppedImg]);

  const handleCropComplete = async () => {
    if (!completedCrop || !canvasRef.current) return;
    
    const croppedFile = await getCroppedImg(canvasRef.current, completedCrop, zoom, rotation);
    if (croppedFile) {
      onCropComplete(croppedFile);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ajustar Foto de Perfil</DialogTitle>
          <DialogDescription>
            Arraste para ajustar a área da foto. A imagem será cortada em formato circular.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Área de Crop */}
          <div className="space-y-4">
            {imageSrc && (
              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                  minWidth={MIN_CROP_SIZE}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-h-96 w-auto"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                </ReactCrop>
              </div>
            )}

            {/* Controles */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[zoom]}
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.1}
                  onValueChange={([value]) => setZoom(value)}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-gray-500" />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Girar 90°
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700">Preview</h3>
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 aspect-square">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm text-center">
                  Ajuste a área da foto para ver o preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas hidden for processing */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={previewCanvasRef} className="hidden" />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleCropComplete} disabled={!completedCrop}>
            Salvar Foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
