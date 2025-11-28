import { Request, Response } from 'express';
import BankAccount from '../models/BankAccount';
import { AuthRequest } from '../middleware/auth';

export const addBankAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bankName, accountNumber, ifscCode, accountHolderName } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        if (!bankName || !accountNumber || !ifscCode || !accountHolderName) {
            res.status(400).json({ success: false, message: 'All bank account details are required' });
            return;
        }

        const existingAccount = await BankAccount.findOne({ userId, accountNumber });
        if (existingAccount) {
            res.status(400).json({ success: false, message: 'Bank account already exists' });
            return;
        }

        const accountCount = await BankAccount.countDocuments({ userId });
        const isDefault = accountCount === 0;


        const bankAccount = await BankAccount.create({
            userId,
            bankName,
            accountNumber: accountNumber.replace(/\s/g, ''),
            ifscCode: ifscCode.toUpperCase(),
            accountHolderName,
            isVerified: true,
            isDefault,
        });

        res.json({
            success: true,
            message: 'Bank account added successfully',
            data: {
                bankAccount: {
                    id: bankAccount._id,
                    bankName: bankAccount.bankName,
                    accountNumber: bankAccount.accountNumber.slice(-4),
                    ifscCode: bankAccount.ifscCode,
                    accountHolderName: bankAccount.accountHolderName,
                    isVerified: bankAccount.isVerified,
                    isDefault: bankAccount.isDefault,
                },
            },
        });
    } catch (error) {
        console.error('Add bank account error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getBankAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const bankAccounts = await BankAccount.find({ userId })
            .sort({ isDefault: -1, createdAt: -1 })
            .select('-userId')
            .lean();

        const maskedAccounts = bankAccounts.map(account => ({
            ...account,
            accountNumber: `XXXXXX${account.accountNumber.slice(-4)}`,
        }));

        res.json({
            success: true,
            data: {
                bankAccounts: maskedAccounts,
            },
        });
    } catch (error) {
        console.error('Get bank accounts error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const setDefaultBankAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { accountId } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        await BankAccount.updateMany(
            { userId },
            { $set: { isDefault: false } }
        );

        const updatedAccount = await BankAccount.findOneAndUpdate(
            { _id: accountId, userId },
            { $set: { isDefault: true } },
            { new: true }
        );

        if (!updatedAccount) {
            res.status(404).json({ success: false, message: 'Bank account not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Default bank account updated successfully',
            data: {
                bankAccount: {
                    id: updatedAccount._id,
                    bankName: updatedAccount.bankName,
                    accountNumber: updatedAccount.accountNumber.slice(-4),
                    isDefault: updatedAccount.isDefault,
                },
            },
        });
    } catch (error) {
        console.error('Set default bank account error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const removeBankAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { accountId } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const account = await BankAccount.findOne({ _id: accountId, userId });

        if (!account) {
            res.status(404).json({ success: false, message: 'Bank account not found' });
            return;
        }

        if (account.isDefault) {
            res.status(400).json({ success: false, message: 'Cannot remove default bank account' });
            return;
        }

        await BankAccount.findByIdAndDelete(accountId);

        res.json({
            success: true,
            message: 'Bank account removed successfully',
        });
    } catch (error) {
        console.error('Remove bank account error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};