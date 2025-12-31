import express from 'express';
import { employeeLogin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/employee/login', employeeLogin);

export default router;
