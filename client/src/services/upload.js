import api from './api';

export const uploadService = {
  // Validate image file before upload
  validateImage(file) {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG and PNG images are allowed.'
      };
    }

    // Check file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit.'
      };
    }

    // Check file size minimum (too small images are usually problematic)
    const MIN_SIZE = 1024; // 1KB minimum
    if (file.size < MIN_SIZE) {
      return {
        valid: false,
        error: 'File size too small. Please upload a proper image.'
      };
    }

    return { valid: true };
  },

  // Validate image dimensions
  async validateImageDimensions(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const MIN_WIDTH = 100;
          const MIN_HEIGHT = 100;
          const MAX_WIDTH = 4000;
          const MAX_HEIGHT = 4000;

          if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
            resolve({
              valid: false,
              error: `Image too small. Minimum dimensions: ${MIN_WIDTH}x${MIN_HEIGHT}px. Your image: ${img.width}x${img.height}px`
            });
          } else if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            resolve({
              valid: false,
              error: `Image too large. Maximum dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}px. Your image: ${img.width}x${img.height}px`
            });
          } else {
            resolve({ valid: true });
          }
        };

        img.onerror = () => {
          resolve({
            valid: false,
            error: 'Failed to load image. The file may be corrupted.'
          });
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        resolve({
          valid: false,
          error: 'Failed to read file.'
        });
      };

      reader.readAsDataURL(file);
    });
  },

  async uploadImage(file) {
    // Perform client-side validation
    const basicValidation = this.validateImage(file);
    if (!basicValidation.valid) {
      throw new Error(basicValidation.error);
    }

    // Validate image dimensions
    const dimensionValidation = await this.validateImageDimensions(file);
    if (!dimensionValidation.valid) {
      throw new Error(dimensionValidation.error);
    }

    // Upload to server
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }
};