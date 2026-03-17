import React, { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const ImageUpload = ({ onImageUpload, loading }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      alert('Please select a JPEG or PNG image');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    onImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  return (
    <div className="control-group">
      <h3>Image Upload</h3>

      <div
        className={`image-upload ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInput}
          disabled={loading}
        />

        {loading ? (
          <div>
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <div>
            <div className="upload-icon" aria-hidden="true">
              <FiUploadCloud />
            </div>
            <div className="upload-text">
              Drop an image here or click to select
            </div>
            <div className="upload-subtext">
              Supports PNG and JPEG (max 10MB)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;