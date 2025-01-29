import React, { useState } from 'react';

interface FileUploadProps {
  onFileChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

const UploadFile: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = '*',
  multiple = false,
  label = 'Upload File',
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles(fileList);
      onFileChange(fileList);
    }
  };

  return (
    <div>
      <label
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        {label}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Selected Files:</strong>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadFile;