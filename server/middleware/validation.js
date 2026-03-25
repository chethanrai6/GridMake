const { body, param } = require('express-validator');

// User registration validation
const validateSignup = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
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
        .optional({ checkFalsy: true })
        .notEmpty()
        .withMessage('Image path cannot be empty'),

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
        .withMessage('Line color must be a valid hex color (e.g., #000000 or #FFF)'),

    body('gridSettings.diagonals')
        .optional()
        .isBoolean()
        .withMessage('Diagonals must be true or false'),

    body('gridSettings.gridVisible')
        .optional()
        .isBoolean()
        .withMessage('Grid visibility must be true or false'),


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