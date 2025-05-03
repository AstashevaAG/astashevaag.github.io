import { useRef } from 'react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
}

export function FileUpload({ onFileSelected, accept = ".png,.jpg,.jpeg,.gb7" }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        ref={fileInputRef}
        className="file-input"
        accept={accept}
        onChange={handleFileChange}
      />
      <button 
        type="button" 
        onClick={handleButtonClick}
        className="upload-button"
      >
        Загрузить изображение
      </button>
    </div>
  );
}

export default FileUpload; 