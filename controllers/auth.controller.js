import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

/* ================= EMPLOYEE LOGIN (PASSWORDLESS) ================= */
export const employeeLogin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
            });
        }

        // 1️⃣ Find employee by email
        const employee = await prisma.employee.findUnique({
            where: {
                primaryEmail: email.toLowerCase(),
            },
        });

        if (!employee) {
            return res.status(401).json({
                message: 'Employee not found',
            });
        }

        if (!employee.isActive) {
            return res.status(403).json({
                message: 'Employee account is inactive',
            });
        }

        // 2️⃣ Generate JWT (NO PASSWORD CHECK)
        const token = jwt.sign(
            {
                id: employee.id,
                employeeId: employee.employeeId,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 3️⃣ Remove password before sending
        const { password, ...safeEmployee } = employee;

        return res.status(200).json({
            message: 'Login successful',
            token,
            employee: safeEmployee,
            loginAt: new Date().toISOString(),
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Login failed',
            error: error.message,
        });
    }
};
