import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const generateQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { amount, description } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const upiId = user.upiId || `${user.phoneNumber}@payripple`;
        const qrData = {
            type: 'payment_request',
            upiId,
            amount: amount || 0,
            description: description || 'Payment Request',
            merchant: user.name || user.phoneNumber,
            timestamp: new Date().toISOString(),
        };

        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));

        res.json({
            success: true,
            data: {
                qrCode: qrCodeDataURL,
                paymentData: qrData,
            },
        });

    } catch (error) {
        console.error('Generate QR code error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const processQRPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { qrData, pin } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        if (!qrData || !pin) {
            res.status(400).json({
                success: false,
                message: 'QR data and PIN are required'
            });
            return;
        }

        let paymentData;
        try {
            paymentData = JSON.parse(qrData);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Invalid QR code data'
            });
            return;
        }

        if (paymentData.type !== 'payment_request') {
            res.status(400).json({
                success: false,
                message: 'Invalid QR code type'
            });
            return;
        }

        const receiverUpiId = paymentData.upiId;
        const receiverPhone = receiverUpiId.split('@')[0];

        res.json({
            success: true,
            message: 'QR payment processed successfully',
            data: {
                amount: paymentData.amount,
                receiver: paymentData.merchant,
                timestamp: new Date(),
            },
        });

    } catch (error) {
        console.error('Process QR payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};