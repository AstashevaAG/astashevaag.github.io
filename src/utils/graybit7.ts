export interface GrayBit7Result {
  imageData: ImageData;
  width: number;
  height: number;
  hasMask: boolean;
  version: number;
}

export const parseGrayBit7 = (arrayBuffer: ArrayBuffer): GrayBit7Result | null => {
  const dataView = new DataView(arrayBuffer);
  
  if (arrayBuffer.byteLength < 12) {
    console.error('Файл слишком маленький для формата GrayBit-7');
    return null;
  }
  
  if (
    dataView.getUint8(0) !== 0x47 || 
    dataView.getUint8(1) !== 0x42 || 
    dataView.getUint8(2) !== 0x37 || 
    dataView.getUint8(3) !== 0x1D    
  ) {
    console.error('Неверная сигнатура файла GrayBit-7');
    return null;
  }
  
  const version = dataView.getUint8(4);
  const flags = dataView.getUint8(5);
  const hasMask = (flags & 0x01) === 1;
  const width = dataView.getUint16(6, false);
  const height = dataView.getUint16(8, false);
  
  const expectedSize = 12 + (width * height);
  if (arrayBuffer.byteLength < expectedSize) {
    console.error(`Неверный размер файла GrayBit-7. Ожидается: ${expectedSize}, получено: ${arrayBuffer.byteLength}`);
    return null;
  }
  
  const dataOffset = 12;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const imageData = ctx.createImageData(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const byteIndex = dataOffset + pixelIndex;
      
      if (byteIndex >= arrayBuffer.byteLength) {
        console.error('Неверный размер файла GrayBit-7');
        return null;
      }
      
      const pixelByte = dataView.getUint8(byteIndex);
      
      const grayValue = pixelByte & 0x7F;
      const maskBit = hasMask ? ((pixelByte & 0x80) >>> 7) : 1;
      
      const normalizedGray = Math.round((grayValue * 255) / 127);
      
      const dataIndex = pixelIndex * 4;
      imageData.data[dataIndex] = normalizedGray;
      imageData.data[dataIndex + 1] = normalizedGray;
      imageData.data[dataIndex + 2] = normalizedGray;
      imageData.data[dataIndex + 3] = maskBit ? 255 : 0;
    }
  }
  
  return { imageData, width, height, hasMask, version };
};

export const createGrayBit7 = (imageData: ImageData, hasMask: boolean = false): ArrayBuffer => {
  const { width, height, data } = imageData;
  
  const buffer = new ArrayBuffer(12 + (width * height));
  const dataView = new DataView(buffer);
  
  dataView.setUint8(0, 0x47);
  dataView.setUint8(1, 0x42);
  dataView.setUint8(2, 0x37);
  dataView.setUint8(3, 0x1D);
  
  dataView.setUint8(4, 0x01);
  dataView.setUint8(5, hasMask ? 0x01 : 0x00);
  dataView.setUint16(6, width, false);
  dataView.setUint16(8, height, false);
  dataView.setUint16(10, 0x0000);
  
  const dataOffset = 12;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const byteIndex = dataOffset + pixelIndex;
      
      const dataIndex = pixelIndex * 4;
      const r = data[dataIndex];
      const g = data[dataIndex + 1];
      const b = data[dataIndex + 2];
      const a = data[dataIndex + 3];
      
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      
      const normalizedGray = Math.round((gray * 127) / 255) & 0x7F;
      
      const maskBit = hasMask ? (a >= 128 ? 1 : 0) : 0;
      
      const pixelByte = normalizedGray | (maskBit << 7);
      
      dataView.setUint8(byteIndex, pixelByte);
    }
  }
  
  return buffer;
}; 