import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
    phoneNumber: string;
    otp: string;
    expiresAt: Date;
    attempts: number;
    isUsed: boolean;
    createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
    {
        phoneNumber: {
            type: String,
            required: true,
            index: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // TTL index
        },
        attempts: {
            type: Number,
            default: 0,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// TTL index for automatic expiration
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model<IOTP>('OTP', OTPSchema);
export default OTP;