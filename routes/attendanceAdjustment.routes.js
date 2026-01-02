import express from 'express';
import {
    requestAdjustment,
    getMyAdjustments,
} from '../controllers/attendanceAdjustment.controller.js';

const router = express.Router();

router.post('/request', requestAdjustment);
router.get('/employee/:employeeId', getMyAdjustments);

export default router;
