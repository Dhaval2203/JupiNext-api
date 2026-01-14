import express from 'express';
import {
    getJobs,
    createJob,
    updateJob,
    toggleJobStatus,
    reorderJobs,
} from '../controllers/job.controller.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.patch('/:id/status', toggleJobStatus);
router.patch('/reorder', reorderJobs);

export default router;
