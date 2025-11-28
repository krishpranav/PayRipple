import mongoose, { Document, Schema } from 'mongoose';

export type TransferStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface IP2PTransfer extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    amount: number;
    description?: string;
    status: TransferStatus;
    referenceId: string;
    transactionId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const P2PTransferSchema = new Schema<IP2PTransfer>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            default: 'pending',
        },
        referenceId: {
            type: String,
            required: true,
            unique: true,
        },
        transactionId: {
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

P2PTransferSchema.index({ senderId: 1, createdAt: -1 });
P2PTransferSchema.index({ receiverId: 1, createdAt: -1 });
P2PTransferSchema.index({ referenceId: 1 });
P2PTransferSchema.index({ status: 1 });

export default mongoose.model<IP2PTransfer>('P2PTransfer', P2PTransferSchema);