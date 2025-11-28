import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    balance: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for frequent queries
walletSchema.index({ userId: 1 });

export default mongoose.model<IWallet>('Wallet', walletSchema);