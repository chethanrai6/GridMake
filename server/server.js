const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');

const configuredOrigins = [
    ...(process.env.CLIENT_URLS || '').split(','),
    process.env.CLIENT_URL || ''
]
    .map(origin => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin)
    .filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0
    ? [...new Set(configuredOrigins)]
    : ['http://localhost:3000'];

const corsOrigin = (origin, callback) => {
    // Allow server-to-server requests and tools that don't send an Origin header
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
};

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploaded images
app.use('/uploads', cors({ origin: corsOrigin }), express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Drawing Grid Maker API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;