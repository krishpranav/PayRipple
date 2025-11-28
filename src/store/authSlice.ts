import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Wallet } from '../types';
import { authService } from '../services/authService';
import { walletService } from '../services/walletService';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants/config';

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    wallet: undefined,
};

export const sendOTP = createAsyncThunk(
    'auth/sendOTP',
    async (phoneNumber: string, { rejectWithValue }) => {
        try {
            const response = await authService.sendOTP(phoneNumber);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
        }
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (data: { phoneNumber: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await authService.verifyOTP(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
        }
    }
);

export const setPIN = createAsyncThunk(
    'auth/setPIN',
    async (data: { phoneNumber: string; pin: string }, { rejectWithValue }) => {
        try {
            const response = await authService.setPIN(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to set PIN');
        }
    }
);

export const fetchWalletBalance = createAsyncThunk(
    'auth/fetchWalletBalance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await walletService.getBalance();
            return response.data.balance;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.wallet = undefined;
            SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
            SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        },
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        updateWalletBalance: (state, action: PayloadAction<number>) => {
            if (state.wallet) {
                state.wallet.balance = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendOTP.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendOTP.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(verifyOTP.fulfilled, (state, action) => {
                if (action.payload.token && action.payload.user) {
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
                    SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(action.payload.user));
                }
            })

            .addCase(setPIN.fulfilled, (state, action) => {
                if (action.payload.success) {
                }
            })

            .addCase(fetchWalletBalance.fulfilled, (state, action) => {
                state.wallet = action.payload;
            });
    },
});

export const { logout, setCredentials, updateWalletBalance } = authSlice.actions;
export default authSlice.reducer;