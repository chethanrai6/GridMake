const mongoose = require('mongoose');

const gridSettingsSchema = new mongoose.Schema({
    rows: {
        type: Number,
        default: 10,
        min: [1, 'Rows must be at least 1'],
        max: [50, 'Rows cannot exceed 50']
    },
    cols: {
        type: Number,
        default: 10,
        min: [1, 'Columns must be at least 1'],
        max: [50, 'Columns cannot exceed 50']
    },
    lineColor: {
        type: String,
        default: '#000000',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
    },
    lineThickness: {
        type: Number,
        default: 2,
        min: [1, 'Line thickness must be at least 1'],
        max: [20, 'Line thickness cannot exceed 20']
    },
    diagonals: {
        type: Boolean,
        default: false
    },
    gridVisible: {
        type: Boolean,
        default: true
    }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    imagePath: {
        type: String,
        required: [true, 'Image path is required']
    },
    gridSettings: {
        type: gridSettingsSchema,
        default: () => ({})
    }
}, {
    timestamps: true
});

// Index for efficient querying
projectSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);