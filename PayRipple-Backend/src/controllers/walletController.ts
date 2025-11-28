import { Request, Response } from 'express';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';

export const getWalletBalance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        let wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            wallet = await Wallet.create({ userId });
        }

        res.json({
            success: true,
            data: {
                balance: wallet.balance,
                currency: wallet.currency,
                isActive: wallet.isActive,
            },
        });
    } catch (error) {
        console.error('Get wallet balance error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const addMoneyToWallet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { amount, bankAccountId } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        if (!amount || amount <= 0) {
            res.status(400).json({ success: false, message: 'Valid amount is required' });
            return;
        }


        let wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            wallet = await Wallet.create({ userId });
        }

        wallet.balance += amount;
        await wallet.save();

        const transaction = await Transaction.create({
            userId,
            walletId: wallet._id,
            type: 'credit',
            amount,
            status: 'success',
            description: `Wallet top-up via bank transfer`,
            referenceId: `TXN${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`,
            metadata: {
                bankAccount: bankAccountId,
            },
        });

        res.json({
            success: true,
            message: 'Money added to wallet successfully',
            data: {
                newBalance: wallet.balance,
                transaction: {
                    id: transaction._id,
                    amount: transaction.amount,
                    type: transaction.type,
                    status: transaction.status,
                    referenceId: transaction.referenceId,
                    createdAt: transaction.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Add money to wallet error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getWalletTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { page = 1, limit = 20 } = req.query;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .select('-metadata -walletId')
            .lean();

        const total = await Transaction.countDocuments({ userId });

        res.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalTransactions: total,
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1,
                },
            },
        });
    } catch (error) {
        console.error('Get wallet transactions error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};