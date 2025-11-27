import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    phoneNumber: string;
    email?: string;
    name?: string;
    pin: string;
    isVerified: boolean;
    kycStatus: 'none' | 'pending' | 'verified' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
    comparePin(candidatePin: string): Promise<boolean>;
    hashPin(pin: string): Promise<string>;
}

const userSchema = new Schema<IUser>(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            sparse: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            trim: true,
        },
        pin: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        kycStatus: {
            type: String,
            enum: ['none', 'pending', 'verified', 'rejected'],
            default: 'none',
        },
    },
    {
        timestamps: true,
    }
);

userSchema.statics.hashPin = async function (pin: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(pin, salt);
};

userSchema.methods.comparePin = async function (candidatePin: string): Promise<boolean> {
    return bcrypt.compare(candidatePin, this.pin);
};

userSchema.index({ phoneNumber: 1 });
userSchema.index({ createdAt: 1 });

const User = mongoose.model<IUser>('User', userSchema);
export default User;