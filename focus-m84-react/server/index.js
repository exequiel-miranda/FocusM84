const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_m84';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB conectado exitosamente'))
    .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/history', require('./routes/history'));
app.use('/api/reasons', require('./routes/reasons'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Focus M84 API funcionando' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
