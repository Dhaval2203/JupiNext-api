import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

/* ================= LOGIN ================= */
export const employeeLogin = async (req, res) => {
    const { email, password } = req.body;

    const employee = await prisma.employee.findUnique({
        where: { primaryEmail: email.toLowerCase() },
    });

    if (!employee || !employee.password)
        return res.status(401).json({ message: 'Invalid credentials' });

    if (!employee.isActive)
        return res.status(403).json({ message: 'Account inactive' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch)
        return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { id: employee.id, employeeId: employee.employeeId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    const { password: _, ...safeEmployee } = employee;
    res.json({ token, employee: safeEmployee });
};

/* ================= SEND OTP ================= */
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const employee = await prisma.employee.findUnique({
            where: { primaryEmail: email.toLowerCase() },
        });

        // Always return same response (security)
        if (!employee) {
            return res.json({
                message: 'If email exists, OTP has been sent',
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        await prisma.employee.update({
            where: { id: employee.id },
            data: {
                resetOtp: otp,
                resetOtpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
            },
        });

        /* ================= EMAIL TEMPLATE ================= */
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color:#2563eb;">Password Reset OTP</h2>
                <p>Hello ${employee.employeeName || 'Employee'},</p>
                <p>Your OTP for password reset is:</p>

                <div style="
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 4px;
                    margin: 16px 0;
                ">
                    ${otp}
                </div>

                <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you didn’t request this, please ignore this email.</p>

                <br />
                <p style="color:#555;">
                    — JupiNext HR System
                </p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: 'JupiNext | Password Reset OTP',
            html,
        });

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('OTP Email Error:', error);
        res.status(500).json({
            message: 'Failed to send OTP',
        });
    }
};

/* ================= VERIFY OTP & RESET PASSWORD ================= */
export const verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const employee = await prisma.employee.findUnique({
        where: { primaryEmail: email.toLowerCase() },
    });

    if (
        !employee ||
        employee.resetOtp !== otp ||
        employee.resetOtpExpiry < new Date()
    ) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.employee.update({
        where: { id: employee.id },
        data: {
            password: hash,
            resetOtp: null,
            resetOtpExpiry: null,
        },
    });

    res.json({ message: 'Password reset successful' });
};
