const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');

// @desc    Get all projects for authenticated user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ owner: req.userId })
            .sort({ updatedAt: -1 })
            .select('-__v');

        res.json({
            success: true,
            count: projects.length,
            data: { projects }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.userId
        }).select('-__v');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: { project }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, imagePath, gridSettings } = req.body;

        const project = new Project({
            owner: req.userId,
            name,
            imagePath,
            gridSettings: gridSettings || {}
        });

        await project.save();

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: { project }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId },
            { 
                ...req.body,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: { project }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.userId
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete associated image file if it exists
        try {
            const imagePath = path.join(__dirname, '..', project.imagePath);
            await fs.unlink(imagePath);
        } catch (fileError) {
            // File may not exist or already deleted, log but don't fail
            console.log('Could not delete image file:', fileError.message);
        }

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};