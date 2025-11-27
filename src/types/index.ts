export interface User {
    id: string;
    phoneNumber: string;
    name?: string;
    email?: string;
    isVerified: boolean;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
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