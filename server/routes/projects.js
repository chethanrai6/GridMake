const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { validateProject, validateObjectId } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/projects
// @desc    Get all projects for user
// @access  Private
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', validateObjectId, getProject);

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', validateProject, createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', [...validateObjectId, ...validateProject], updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', validateObjectId, deleteProject);

module.exports = router;