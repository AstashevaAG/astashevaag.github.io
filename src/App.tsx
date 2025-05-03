import { useState, useCallback } from 'react'
import { parseGrayBit7 } from './utils/graybit7'
import FileUpload from './components/FileUpload'
import ImageCanvas from './components/ImageCanvas'
import StatusBar from './components/StatusBar'
import './App.css'

interface ImageInfo {
  width: number;
  height: number;
  colorDepth: number;
  format: string;
}

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const [imageHeight, setImageHeight] = useState<number | undefined>(undefined);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileSelected = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
    
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      setImageUrl(null);
      setImageData(null);
      setImageWidth(undefined);
      setImageHeight(undefined);
      setImageInfo(null);
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'gb7') {
        const arrayBuffer = await file.arrayBuffer();
        const result = parseGrayBit7(arrayBuffer);
        
        if (result) {
          const { imageData, width, height } = result;
          
          setImageData(imageData);
          setImageWidth(width);
          setImageHeight(height);
          setImageInfo({
            width,
            height,
            colorDepth: 7,
            format: 'GrayBit-7'
          });
        }
      } else {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      }
    } catch (error) {
      console.error('Ошибка при обработке файла:', error);
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl]);
  
  const handleImageLoaded = useCallback((width: number, height: number) => {
    const fileExtension = imageUrl?.split('.').pop()?.toLowerCase() || 'Unknown';
    
    setImageInfo({
      width,
      height,
      colorDepth: 24, 
      format: fileExtension.toUpperCase()
    });
  }, [imageUrl]);

  return (
    <div className="app-container">
      <header>
        <h1>Фоторедактор</h1>
      </header>
      
      <main>
        <FileUpload onFileSelected={handleFileSelected} />
        
        <div className={`canvas-container ${isLoading ? 'loading' : ''}`}>
          <ImageCanvas 
            imageUrl={imageUrl}
            imageData={imageData}
            width={imageWidth}
            height={imageHeight}
            onImageLoaded={handleImageLoaded}
          />
          {isLoading && <div className="loading-indicator">Загрузка...</div>}
        </div>
      </main>
      
      <StatusBar imageInfo={imageInfo} />
    </div>
  )
}

export default App
