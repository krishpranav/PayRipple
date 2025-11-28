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