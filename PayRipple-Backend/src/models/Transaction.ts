import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'credit' | 'debit' | 'transfer' | 'refund';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    walletId: mongoose.Types.ObjectId;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    description: string;
    referenceId: string;
    metadata: {
        senderPhone?: string;
        receiverPhone?: string;
        bankAccount?: string;
        upiId?: string;
        p2pTransferId?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        walletId: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true,
        },
        type: {
            type: String,
            enum: ['credit', 'debit', 'transfer', 'refund'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
        description: {
            type: String,
            required: true,
        },
        referenceId: {
            type: String,
            required: true,
            unique: true,
        },
        metadata: {
            senderPhone: String,
            receiverPhone: String,
            bankAccount: String,
            upiId: String,
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ referenceId: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);