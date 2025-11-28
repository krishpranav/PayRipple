import api from './api';
import { QR_ENDPOINTS } from '../constants/config';
import { QRPaymentData } from '../types';

export const qrService = {
    async generateQRCode(amount?: number, description?: string): Promise<{
        success: boolean;
        data: {
            qrCode: string;
            paymentData: QRPaymentData;
        };
    }> {
        const response = await api.post(QR_ENDPOINTS.GENERATE, { amount, description });
        return response.data;
    },

    async processQRPayment(qrData: string, pin: string): Promise<{
        success: boolean;
        message: string;
        data: {
            amount: number;
            receiver: string;
            timestamp: string;
        };
    }> {
        const response = await api.post(QR_ENDPOINTS.PAY, { qrData, pin });
        return response.data;
    },
};