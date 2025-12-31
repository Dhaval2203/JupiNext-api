import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import employeeRoutes from './routes/employee.routes.js';

const app = express();

/* ---------- CORS CONFIG ---------- */
app.use(
    cors({
        origin: 'http://localhost:3000', // Next.js frontend
        credentials: true,
    })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/employees', employeeRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
