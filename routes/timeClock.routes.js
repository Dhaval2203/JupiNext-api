import express from 'express';
import {
    startShift,
    endShift,
    addBreak,
    getTodayTimeClock,
    getMonthlyTimeClock
} from '../controllers/timeClock.controller.js';

const router = express.Router();

router.post('/start', startShift);
router.post('/end', endShift);
router.post('/break', addBreak);
router.get('/today/:employeeId', getTodayTimeClock);
router.get('/month/:employeeId', getMonthlyTimeClock);

export default router;
