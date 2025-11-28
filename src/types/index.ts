export interface User {
    id: string;
    phoneNumber: string;
    name?: string;
    email?: string;
    isVerified: boolean;
    createdAt: string;
}

export interface Wallet {
    balance: number;
    currency: string;
    isActive: boolean;
}

export interface Transaction {
    id: string;
    type: 'credit' | 'debit' | 'transfer' | 'refund';
    amount: number;
    status: 'pending' | 'success' | 'failed';
    description: string;
    referenceId: string;
    createdAt: string;
}

export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    isVerified: boolean;
    isDefault: boolean;
    createdAt: string;
}

export interface AddMoneyRequest {
    amount: number;
    bankAccountId: string;
}

export interface AddBankAccountRequest {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    wallet?: Wallet;
}

export interface OTPResponse {
    success: boolean;
    message: string;
    retryDelay?: number;
}

export interface VerifyOTPData {
    phoneNumber: string;
    otp: string;
}

export interface SetPINData {
    phoneNumber: string;
    pin: string;
}

export interface VerifyOTPResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: any;
    isNewUser?: boolean;
}

export interface P2PTransfer {
    id: string;
    type: 'sent' | 'received';
    amount: number;
    description?: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    referenceId: string;
    counterparty: {
        phone: string;
        name?: string;
    };
    timestamp: string;
}

export interface SendMoneyRequest {
    receiverPhone: string;
    amount: number;
    description?: string;
    pin: string;
}

export interface RequestMoneyRequest {
    senderPhone: string;
    amount: number;
    description?: string;
}

export interface QRPaymentData {
    type: 'payment_request';
    upiId: string;
    amount: number;
    description: string;
    merchant: string;
    timestamp: string;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
}
