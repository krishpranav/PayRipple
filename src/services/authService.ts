import api from './api';
import { AUTH_ENDPOINTS } from '../constants/config';
import { OTPResponse, VerifyOTPData, SetPINData } from '../types';

export interface VerifyOTPResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: any;
    isNewUser?: boolean;
}

export const authService = {
    async sendOTP(phoneNumber: string): Promise<OTPResponse> {
        const response = await api.post(AUTH_ENDPOINTS.SEND_OTP, { phoneNumber });
        return response.data;
    },

    async verifyOTP(data: VerifyOTPData): Promise<VerifyOTPResponse> {
        const response = await api.post(AUTH_ENDPOINTS.VERIFY_OTP, data);
        return response.data;
    },

    async setPIN(data: SetPINData): Promise<{ success: boolean; message?: string }> {
        const response = await api.post(AUTH_ENDPOINTS.SET_PIN, data);
        return response.data;
    },

    async verifyPIN(phoneNumber: string, pin: string): Promise<{ success: boolean; token?: string; message?: string }> {
        const response = await api.post(AUTH_ENDPOINTS.VERIFY_PIN, { phoneNumber, pin });
        return response.data;
    },
};