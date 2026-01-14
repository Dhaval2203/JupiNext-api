import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import timeClockRoutes from './routes/timeClock.routes.js';
import adjustmentRoutes from './routes/attendanceAdjustment.routes.js';

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.jupinext.com',
    'https://jupinext.com',
    'https://jupinext-employee.netlify.app',
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});
