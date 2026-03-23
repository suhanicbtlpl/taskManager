const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bootstrapAdmin = require('./config/adminBootstrap');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/permissions', require('./routes/permissionRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use(errorHandler);

// Connect to Database and Start Server
connectDB().then(async () => {
    // Bootstrap Admin
    console.log('Database connected, starting admin bootstrap...');
    await bootstrapAdmin();
    console.log('Admin bootstrap completed successfully.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});
