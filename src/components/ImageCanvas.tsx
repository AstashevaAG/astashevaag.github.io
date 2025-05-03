import { useRef, useEffect } from 'react';

interface ImageCanvasProps {
  imageUrl?: string | null;
  imageData?: ImageData | null;
  width?: number;
  height?: number;
  onImageLoaded?: (width: number, height: number) => void;
}

export function ImageCanvas({ 
  imageUrl, 
  imageData, 
  width, 
  height, 
  onImageLoaded 
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      onImageLoaded?.(img.width, img.height);
    };
    
    img.src = imageUrl;
    
    return () => {
    };
  }, [imageUrl, onImageLoaded]);

  useEffect(() => {
    if (!imageData || !width || !height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(imageData, 0, 0);
    
  }, [imageData, width, height]);

  return (
    <canvas 
      ref={canvasRef}
      className="image-canvas"
    />
  );
}

export default ImageCanvas; 