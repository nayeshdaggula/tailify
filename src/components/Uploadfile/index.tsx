import React, { useState } from 'react';

interface FileUploadProps {
    onFileChange: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    label?: string;
    containerClass?: string;
}

const UploadFile: React.FC<FileUploadProps> = ({
    onFileChange,
    accept = '*',
    multiple = false,
    label = 'Upload File',
    containerClass = {},
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
                className={`inline-block px-[20px] py-[10px] text-black border border-black border-dashed rounded-md cursor-pointer text-center w-full ${containerClass}`}
            >
                {selectedFiles.length === 1 ? (
                    selectedFiles.map((file, index) => (
                        <p key={index}>{file.name}</p>
                    ))
                ) :
                    label
                }
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </label>
            {selectedFiles.length > 1 && (
                <div style={{ marginTop: '10px' }}>
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

export { UploadFile };