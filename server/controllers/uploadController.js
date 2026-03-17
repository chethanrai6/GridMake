const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image validation - checks image dimensions
const validateImageContent = async (filePath) => {
    try {
        const metadata = await sharp(filePath).metadata();
        
        const MIN_WIDTH = 100;
        const MIN_HEIGHT = 100;
        const MAX_WIDTH = 4000;
        const MAX_HEIGHT = 4000;
        
        if (metadata.width < MIN_WIDTH || metadata.height < MIN_HEIGHT) {
            return {
                valid: false,
                reason: 'Image dimensions too small. Minimum 100x100 pixels required.'
            };
        }
        
        if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
            return {
                valid: false,
                reason: 'Image dimensions too large. Maximum 4000x4000 pixels allowed.'
            };
        }
        
        return { valid: true };
    } catch (error) {
        console.error('Image validation error:', error);
        return {
            valid: false,
            reason: 'Image validation failed. The file may be corrupted or unsupported.'
        };
    }
};

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG images are allowed'), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
    },
    fileFilter: fileFilter
});

// @desc    Upload image file
// @route   POST /api/upload
// @access  Private
const uploadImage = (req, res, next) => {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum size is 10MB.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        try {
            // Validate image content (dimensions)
            const validation = await validateImageContent(req.file.path);
            
            if (!validation.valid) {
                // Delete the uploaded file if validation fails
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting invalid file:', err);
                });
                
                return res.status(400).json({
                    success: false,
                    message: validation.reason
                });
            }

            // Return file information
            res.json({
                success: true,
                message: 'File uploaded successfully',
                data: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    path: 'uploads/' + req.file.filename,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                }
            });
        } catch (error) {
            // Clean up file on error
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file after validation error:', err);
            });
            
            res.status(500).json({
                success: false,
                message: 'File validation failed: ' + error.message
            });
        }
    });
};

module.exports = {
    uploadImage
};