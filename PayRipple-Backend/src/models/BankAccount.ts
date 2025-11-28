import mongoose, { Document, Schema } from 'mongoose';

export interface IBankAccount extends Document {
    userId: mongoose.Types.ObjectId;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    isVerified: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const bankAccountSchema = new Schema<IBankAccount>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bankName: {
            type: String,
            required: true,
            trim: true,
        },
        accountNumber: {
            type: String,
            required: true,
            trim: true,
        },
        ifscCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        accountHolderName: {
            type: String,
            required: true,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index
bankAccountSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

export default mongoose.model<IBankAccount>('BankAccount', bankAccountSchema);