import { Request, Response } from 'express';
import User from '../models/User';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import P2PTransfer from '../models/P2PTransfer';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const sendMoney = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { receiverPhone, amount, description, pin } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        if (!receiverPhone || !amount || !pin) {
            res.status(400).json({
                success: false,
                message: 'Receiver phone, amount, and PIN are required'
            });
            return;
        }

        if (amount <= 0) {
            res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const isPinValid = await user.comparePin(pin);
        if (!isPinValid) {
            res.status(400).json({ success: false, message: 'Invalid PIN' });
            return;
        }

        const receiver = await User.findOne({ phoneNumber: receiverPhone });
        if (!receiver) {
            res.status(404).json({
                success: false,
                message: 'Receiver not found. Please check the phone number.'
            });
            return;
        }

        if (receiver._id.toString() === userId) {
            res.status(400).json({
                success: false,
                message: 'Cannot send money to yourself'
            });
            return;
        }

        const senderWallet = await Wallet.findOne({ userId });
        if (!senderWallet || senderWallet.balance < amount) {
            res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
            return;
        }

        let receiverWallet = await Wallet.findOne({ userId: receiver._id });
        if (!receiverWallet) {
            receiverWallet = await Wallet.create({ userId: receiver._id });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const referenceId = `P2P${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;

            const senderTransaction = await Transaction.create([{
                userId,
                walletId: senderWallet._id,
                type: 'debit',
                amount,
                status: 'success',
                description: description || `Sent to ${receiver.phoneNumber}`,
                referenceId: `${referenceId}-DEBIT`,
                metadata: {
                    receiverPhone: receiver.phoneNumber,
                    p2pTransferId: referenceId,
                },
            }], { session });

            const receiverTransaction = await Transaction.create([{
                userId: receiver._id,
                walletId: receiverWallet._id,
                type: 'credit',
                amount,
                status: 'success',
                description: description || `Received from ${user.phoneNumber}`,
                referenceId: `${referenceId}-CREDIT`,
                metadata: {
                    senderPhone: user.phoneNumber,
                    p2pTransferId: referenceId,
                },
            }], { session });

            await Wallet.findByIdAndUpdate(
                senderWallet._id,
                { $inc: { balance: -amount } },
                { session }
            );

            await Wallet.findByIdAndUpdate(
                receiverWallet._id,
                { $inc: { balance: amount } },
                { session }
            );

            const p2pTransfer = await P2PTransfer.create([{
                senderId: userId,
                receiverId: receiver._id,
                amount,
                description,
                status: 'completed',
                referenceId,
                transactionId: senderTransaction[0]._id,
            }], { session });

            await session.commitTransaction();

            res.json({
                success: true,
                message: 'Money sent successfully',
                data: {
                    transfer: {
                        id: p2pTransfer[0]._id,
                        referenceId: p2pTransfer[0].referenceId,
                        amount: p2pTransfer[0].amount,
                        receiverName: receiver.name || receiver.phoneNumber,
                        timestamp: p2pTransfer[0].createdAt,
                    },
                    newBalance: senderWallet.balance - amount,
                },
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Send money error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const requestMoney = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { senderPhone, amount, description } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        if (!senderPhone || !amount) {
            res.status(400).json({
                success: false,
                message: 'Sender phone and amount are required'
            });
            return;
        }

        if (amount <= 0) {
            res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
            return;
        }

        const sender = await User.findOne({ phoneNumber: senderPhone });
        if (!sender) {
            res.status(404).json({
                success: false,
                message: 'Sender not found'
            });
            return;
        }

        const referenceId = `REQ${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;

        res.json({
            success: true,
            message: 'Money request sent successfully',
            data: {
                requestId: referenceId,
                amount,
                senderName: sender.name || sender.phoneNumber,
                timestamp: new Date(),
            },
        });

    } catch (error) {
        console.error('Request money error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getP2PHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { page = 1, limit = 20, type = 'all' } = req.query;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        let query: any = {};

        if (type === 'sent') {
            query.senderId = userId;
        } else if (type === 'received') {
            query.receiverId = userId;
        } else {
            query.$or = [{ senderId: userId }, { receiverId: userId }];
        }

        const transfers = await P2PTransfer.find(query)
            .populate('senderId', 'phoneNumber name')
            .populate('receiverId', 'phoneNumber name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        const total = await P2PTransfer.countDocuments(query);

        const formattedTransfers = transfers.map(transfer => ({
            id: transfer._id,
            type: transfer.senderId._id.toString() === userId ? 'sent' : 'received',
            amount: transfer.amount,
            description: transfer.description,
            status: transfer.status,
            referenceId: transfer.referenceId,
            counterparty: transfer.senderId._id.toString() === userId
                ? {
                    phone: (transfer.receiverId as any).phoneNumber,
                    name: (transfer.receiverId as any).name
                }
                : {
                    phone: (transfer.senderId as any).phoneNumber,
                    name: (transfer.senderId as any).name
                },
            timestamp: transfer.createdAt,
        }));

        res.json({
            success: true,
            data: {
                transfers: formattedTransfers,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalTransfers: total,
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1,
                },
            },
        });

    } catch (error) {
        console.error('Get P2P history error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};