import api from './api';
import { WALLET_ENDPOINTS } from '../constants/config';
import { Wallet, Transaction, AddMoneyRequest } from '../types';

export const walletService = {
    async getBalance(): Promise<{ success: boolean; data: { balance: Wallet } }> {
        const response = await api.get(WALLET_ENDPOINTS.GET_BALANCE);
        return response.data;
    },

    async addMoney(data: AddMoneyRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            newBalance: number;
            transaction: Transaction;
        }
    }> {
        const response = await api.post(WALLET_ENDPOINTS.ADD_MONEY, data);
        return response.data;
    },

    async getTransactions(page: number = 1, limit: number = 20): Promise<{
        success: boolean;
        data: {
            transactions: Transaction[];
            pagination: {
                currentPage: number;
                totalPages: number;
                totalTransactions: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        };
    }> {
        const response = await api.get(
            `${WALLET_ENDPOINTS.TRANSACTIONS}?page=${page}&limit=${limit}`
        );
        return response.data;
    },
};