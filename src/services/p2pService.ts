import api from './api';
import { P2P_ENDPOINTS } from '../constants/config';
import { SendMoneyRequest, RequestMoneyRequest, P2PTransfer } from '../types';

export const p2pService = {
    async sendMoney(data: SendMoneyRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            transfer: {
                id: string;
                referenceId: string;
                amount: number;
                receiverName: string;
                timestamp: string;
            };
            newBalance: number;
        };
    }> {
        const response = await api.post(P2P_ENDPOINTS.SEND_MONEY, data);
        return response.data;
    },

    async requestMoney(data: RequestMoneyRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            requestId: string;
            amount: number;
            senderName: string;
            timestamp: string;
        };
    }> {
        const response = await api.post(P2P_ENDPOINTS.REQUEST_MONEY, data);
        return response.data;
    },

    async getP2PHistory(page: number = 1, limit: number = 20, type: string = 'all'): Promise<{
        success: boolean;
        data: {
            transfers: P2PTransfer[];
            pagination: {
                currentPage: number;
                totalPages: number;
                totalTransfers: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        };
    }> {
        const response = await api.get(
            `${P2P_ENDPOINTS.P2P_HISTORY}?page=${page}&limit=${limit}&type=${type}`
        );
        return response.data;
    },
};