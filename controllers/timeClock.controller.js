import prisma from '../prisma/client.js';
import { diffInSeconds } from '../utils/time.utils.js';

const REQUIRED_SECONDS = 8 * 3600;

/* ================= START SHIFT ================= */
export const startShift = async (req, res) => {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        let record = await prisma.timeClock.findUnique({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: new Date(today),
                },
            },
        });

        if (!record) {
            record = await prisma.timeClock.create({
                data: {
                    employeeId,
                    workDate: new Date(today),
                    startWorkTime: new Date(),
                },
            });
        }

        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= END SHIFT ================= */
export const endShift = async (req, res) => {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        const record = await prisma.timeClock.findUnique({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: new Date(today),
                },
            },
        });

        if (!record) {
            return res.status(404).json({ message: 'Shift not started' });
        }

        const endTime = new Date();
        const totalSessionSeconds = diffInSeconds(
            record.startWorkTime,
            endTime
        );

        const workingSeconds = Math.max(
            totalSessionSeconds - record.totalBreakSeconds,
            0
        );

        const shortageSeconds = Math.max(
            REQUIRED_SECONDS - workingSeconds,
            0
        );

        const updated = await prisma.timeClock.update({
            where: { id: record.id },
            data: {
                endWorkTime: endTime,
                totalWorkSeconds: workingSeconds,
                shortageSeconds,
                isLessThan8Hours: shortageSeconds > 0,
            },
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= ADD BREAK ================= */
export const addBreak = async (req, res) => {
    const { employeeId, breakSeconds } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        const updated = await prisma.timeClock.update({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: new Date(today),
                },
            },
            data: {
                totalBreakSeconds: {
                    increment: breakSeconds,
                },
            },
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= GET TODAY ================= */
export const getTodayTimeClock = async (req, res) => {
    const { employeeId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    try {
        const record = await prisma.timeClock.findUnique({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: new Date(today),
                },
            },
        });

        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMonthlyTimeClock = async (req, res) => {
    const { employeeId } = req.params;
    const { month } = req.query; // YYYY-MM

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const data = await prisma.timeClock.findMany({
            where: {
                employeeId,
                workDate: {
                    gte: start,
                    lt: end,
                },
            },
            select: {
                workDate: true,
                totalWorkSeconds: true,
                totalBreakSeconds: true,
                isLessThan8Hours: true,
            },
        });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to load month data' });
    }
};
