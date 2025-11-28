import api from './api';
import { BANK_ENDPOINTS } from '../constants/config';
import { BankAccount, AddBankAccountRequest } from '../types';

export const bankService = {
    async addAccount(data: AddBankAccountRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            bankAccount: BankAccount;
        };
    }> {
        const response = await api.post(BANK_ENDPOINTS.ADD_ACCOUNT, data);
        return response.data;
    },

    async getAccounts(): Promise<{
        success: boolean;
        data: {
            bankAccounts: BankAccount[];
        };
    }> {
        const response = await api.get(BANK_ENDPOINTS.LIST_ACCOUNTS);
        return response.data;
    },

    async setDefaultAccount(accountId: string): Promise<{
        success: boolean;
        message: string;
    }> {
        const response = await api.put(BANK_ENDPOINTS.SET_DEFAULT, { accountId });
        return response.data;
    },

    async removeAccount(accountId: string): Promise<{
        success: boolean;
        message: string;
    }> {
        const response = await api.delete(`${BANK_ENDPOINTS.REMOVE_ACCOUNT}/${accountId}`);
        return response.data;
    },
};