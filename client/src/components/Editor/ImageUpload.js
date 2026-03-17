import React, { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { uploadService } from '../../services/upload';

const ImageUpload = ({ onImageUpload, loading }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      // Perform comprehensive validation
      const basicValidation = uploadService.validateImage(file);
      if (!basicValidation.valid) {
        toast.error(basicValidation.error);
        return;
      }

      // Validate dimensions
      const dimensionValidation = await uploadService.validateImageDimensions(file);
      if (!dimensionValidation.valid) {
        toast.error(dimensionValidation.error);
        return;
      }

      // File passed all validations, proceed with upload
      onImageUpload(file);
    } catch (error) {
      toast.error(error.message || 'Failed to validate image');
    }
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
              Supports PNG and JPEG (100x100 to 4000x4000px, max 10MB)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;