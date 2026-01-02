import prisma from '../prisma/client.js';
import { diffInSeconds } from '../utils/time.utils.js';

const REQUIRED_SECONDS = 8 * 3600;

/* ======================================================
   HELPERS
   ====================================================== */
const getTodayDateOnly = () => {
    return new Date(new Date().toISOString().split('T')[0]);
};

/* ================= START SHIFT ================= */
export const startShift = async (req, res) => {
    const { employeeId } = req.body;
    const today = getTodayDateOnly();

    try {
        let record = await prisma.timeClock.findUnique({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: today,
                },
            },
        });

        if (!record) {
            record = await prisma.timeClock.create({
                data: {
                    employeeId,
                    workDate: today, // @db.Date safe
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
    const today = getTodayDateOnly();

    try {
        const record = await prisma.timeClock.findUnique({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: today,
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
    const today = getTodayDateOnly();

    try {
        const updated = await prisma.timeClock.update({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: today,
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
    const today = getTodayDateOnly();

    try {
        const record = await prisma.timeClock.findUnique({
            where: {
                employeeId_workDate: {
                    employeeId,
                    workDate: today,
                },
            },
        });

        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   GET MONTHLY (YEAR + MONTH) ✅ FIXED
   URL: /timeclock/month/:employeeId?year=2026&month=01
   ====================================================== */
export const getMonthlyTimeClock = async (req, res) => {
    const { employeeId } = req.params;
    const { year, month } = req.query; // year=2026, month=01

    if (!year || !month) {
        return res
            .status(400)
            .json({ message: 'Year and month are required' });
    }

    try {
        /**
         * IMPORTANT:
         * workDate is @db.Date (no time)
         * Always query using DATE boundaries
         */
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const data = await prisma.timeClock.findMany({
            where: {
                employeeId,
                workDate: {
                    gte: startDate,
                    lt: endDate, // exclusive end (safe)
                },
            },
            orderBy: {
                workDate: 'asc',
            },
            select: {
                workDate: true,
                startWorkTime: true,
                endWorkTime: true,
                totalWorkSeconds: true,
                totalBreakSeconds: true,
                shortageSeconds: true,
                isLessThan8Hours: true,
            },
        });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to load month data',
        });
    }
};
