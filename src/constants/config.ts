export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const AUTH_ENDPOINTS = {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    SET_PIN: '/auth/set-pin',
    VERIFY_PIN: '/auth/verify-pin',
};

export const WALLET_ENDPOINTS = {
    GET_BALANCE: '/wallet/balance',
    ADD_MONEY: '/wallet/add-money',
    TRANSACTIONS: '/wallet/transactions',
};

export const BANK_ENDPOINTS = {
    ADD_ACCOUNT: '/bank/add',
    LIST_ACCOUNTS: '/bank/list',
    SET_DEFAULT: '/bank/set-default',
    REMOVE_ACCOUNT: '/bank/remove',
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
};

export const P2P_ENDPOINTS = {
    SEND_MONEY: '/p2p/send',
    REQUEST_MONEY: '/p2p/request',
    P2P_HISTORY: '/p2p/history',
};

export const QR_ENDPOINTS = {
    GENERATE: '/qr/generate',
    PAY: '/qr/pay',
};