import prisma from '../prisma/client.js';

/* ================= GET ALL ================= */
export const getJobs = async (req, res) => {
    try {
        const { active } = req.query;

        const where = {};

        // If active=true or active=false is passed
        if (active !== undefined) {
            where.isActive = active === 'true';
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { displayOrder: 'asc' },
        });

        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
};

/* ================= CREATE ================= */
export const createJob = async (req, res) => {
    try {
        const lastJob = await prisma.job.findFirst({
            orderBy: { displayOrder: 'desc' },
        });

        const nextOrder = lastJob ? lastJob.displayOrder + 1 : 1;

        const job = await prisma.job.create({
            data: {
                ...req.body,
                displayOrder: nextOrder,
                isActive: true,
            },
        });

        res.status(201).json(job);
    } catch {
        res.status(500).json({ message: 'Failed to create job' });
    }
};

/* ================= UPDATE ================= */
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            displayOrder,
            title,
            department,
            location,
            type,
            experience,
            description,
            requirements,
        } = req.body;

        const job = await prisma.job.update({
            where: { id: Number(id) },
            data: {
                displayOrder: Number(displayOrder), // 🔥 FIX
                title,
                department,
                location,
                type,
                experience,
                description,
                requirements,
            },
        });

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update job',
            error: error.message,
        });
    }
};

/* ================= STATUS ================= */
export const toggleJobStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    await prisma.job.update({
        where: { id: Number(id) },
        data: { isActive },
    });

    res.json({ success: true });
};

/* ================= REORDER ================= */
export const reorderJobs = async (req, res) => {
    const { orders } = req.body;
    // [{ id, displayOrder }]

    const queries = orders.map((o) =>
        prisma.job.update({
            where: { id: o.id },
            data: { displayOrder: o.displayOrder },
        })
    );

    await prisma.$transaction(queries);
    res.json({ success: true });
};
