import prisma from '../prisma/client.js';

/* ================= GET MY ADJUSTMENTS ================= */
export const getMyAdjustments = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const data = await prisma.attendanceAdjustment.findMany({
            where: { employeeId },
            include: {
                timeClock: true,
            },
            orderBy: {
                requestedAt: 'desc',
            },
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load adjustments' });
    }
};

/* ================= REQUEST ADJUSTMENT ================= */
export const requestAdjustment = async (req, res) => {
    const {
        timeClockId,
        employeeId,
        requestedSeconds,
        startTime,
        endTime,
        reason,
        comment,
    } = req.body;

    try {
        const timeClock = await prisma.timeClock.findUnique({
            where: { id: timeClockId },
            include: { adjustment: true },
        });

        if (!timeClock)
            return res.status(404).json({ message: 'Attendance not found' });

        if (!timeClock.isLessThan8Hours)
            return res
                .status(400)
                .json({ message: 'Adjustment not required' });

        if (timeClock.adjustment)
            return res
                .status(400)
                .json({ message: 'Already requested' });

        const adjustment = await prisma.attendanceAdjustment.create({
            data: {
                timeClockId,
                employeeId,
                requestedSeconds,
                reason,
                comment,
                // store times
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });

        await prisma.timeClock.update({
            where: { id: timeClockId },
            data: {
                hasAdjustmentRequest: true,
            },
        });

        res.json(adjustment);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to request adjustment',
        });
    }
};
