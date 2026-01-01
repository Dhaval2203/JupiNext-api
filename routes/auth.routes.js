import express from 'express';
import { employeeLogin, sendResetOtp, verifyOtpAndResetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/employee/login', employeeLogin);
router.post('/employee/forgot-password', sendResetOtp);
router.post('/employee/reset-password', verifyOtpAndResetPassword);

export default router;
