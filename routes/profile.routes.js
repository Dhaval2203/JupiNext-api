import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
    const employee = await prisma.employee.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            employeeId: true,
            employeeName: true,
            designation: true,
            department: true,
            primaryEmail: true,
            secondaryEmail: true,
            isActive: true,
            createdAt: true,
            reportingManagerId: true,
        },
    });

    res.json(employee);
});

export default router;
