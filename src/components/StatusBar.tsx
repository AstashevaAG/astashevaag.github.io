interface ImageInfo {
  width: number;
  height: number;
  colorDepth: number;
  format: string;
}

interface StatusBarProps {
  imageInfo: ImageInfo | null;
}

export function StatusBar({ imageInfo }: StatusBarProps) {
  if (!imageInfo) {
    return (
      <div className="status-bar">
        <div className="image-info">
          Загрузите изображение для просмотра информации
        </div>
      </div>
    );
  }

  return (
    <div className="status-bar">
      <div className="image-info">
        Размер: {imageInfo.width}x{imageInfo.height} px | 
        Глубина цвета: {imageInfo.colorDepth} бит | 
        Формат: {imageInfo.format}
      </div>
    </div>
  );
}

export default StatusBar; 