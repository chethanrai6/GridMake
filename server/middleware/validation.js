const { body, param } = require('express-validator');

// User registration validation
const validateSignup = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// User login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Project creation validation
const validateProject = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Project name must be between 1 and 100 characters'),

    body('imagePath')
        .notEmpty()
        .withMessage('Image path is required'),

    body('gridSettings.rows')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Rows must be between 1 and 50'),

    body('gridSettings.cols')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Columns must be between 1 and 50'),

    body('gridSettings.lineThickness')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Line thickness must be between 1 and 20'),

    body('gridSettings.lineColor')
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Line color must be a valid hex color'),

    body('gridSettings.diagonals')
        .optional()
        .isBoolean()
        .withMessage('Diagonals must be a boolean'),

    body('gridSettings.gridVisible')
        .optional()
        .isBoolean()
        .withMessage('Grid visible must be a boolean')
];

// MongoDB ObjectId validation
const validateObjectId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid project ID')
];

module.exports = {
    validateSignup,
    validateLogin,
    validateProject,
    validateObjectId
};