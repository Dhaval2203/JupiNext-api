// Mongo example (mongoose style)
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeId: String,
    employeeName: String,
    designation: String,
    department: String,
    primaryEmail: { type: String, unique: true },
    password: String,
    isActive: Boolean,
    dateOfBirth: String,
    dateOfJoining: String,
    bankName: String,
    bankAccount: String,
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
