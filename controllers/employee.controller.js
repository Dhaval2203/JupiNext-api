const { prisma } = require('../config/db');
const { hashPassword } = require('../utils/password');

/* ================= GET ALL EMPLOYEES ================= */
exports.getEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                employeeId: true,
                employeeName: true,
                designation: true,
                department: true,
                primaryEmail: true,
                secondaryEmail: true,
                bankName: true,
                bankAccount: true,
                reportingManagerId: true,
                dateOfBirth: true,
                dateOfJoining: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= CREATE EMPLOYEE ================= */
exports.createEmployee = async (req, res) => {
    try {
        const {
            password,
            primaryEmail,
            ...rest
        } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const hashedPassword = await hashPassword(password);

        const employee = await prisma.employee.create({
            data: {
                ...rest,
                primaryEmail: primaryEmail.toLowerCase(),
                password: hashedPassword, // ✅ hashed
            },
        });

        const { password: _, ...safeEmployee } = employee;

        res.status(201).json(safeEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/* ================= UPDATE EMPLOYEE ================= */
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            password,
            primaryEmail,
            ...rest
        } = req.body;

        const updateData = {
            ...rest,
            ...(primaryEmail && { primaryEmail: primaryEmail.toLowerCase() }),
        };

        // 🔐 Only update password if provided
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const employee = await prisma.employee.update({
            where: { id: Number(id) },
            data: updateData,
        });

        const { password: _, ...safeEmployee } = employee;

        res.json(safeEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/* ================= DELETE EMPLOYEE ================= */
exports.deleteEmployee = async (req, res) => {
    try {
        await prisma.employee.delete({
            where: { id: Number(req.params.id) },
        });

        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
