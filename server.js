import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import timeClockRoutes from './routes/timeClock.routes.js';
import adjustmentRoutes from './routes/attendanceAdjustment.routes.js';

const app = express();

/* ================= CORS (ONE SOURCE OF TRUTH) ================= */
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

/* ================= BODY PARSER ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/timeclock', timeClockRoutes);
app.use('/api/attendance-adjustment', adjustmentRoutes);

/* ================= SERVER ================= */
app.listen(5000, () => {
    console.log('🚀 API running on http://localhost:5000');
});
