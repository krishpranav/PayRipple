import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';
import { authService } from '../services/authService';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants/config';

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
};

export const sendOTP = createAsyncThunk(
    'auth/sendOTP',
    async (phoneNumber: string) => {
        const response = await authService.sendOTP(phoneNumber);
        return response;
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (data: { phoneNumber: string; otp: string }) => {
        const response = await authService.verifyOTP(data);
        return response;
    }
);

export const setPIN = createAsyncThunk(
    'auth/setPIN',
    async (data: { phoneNumber: string; pin: string }) => {
        const response = await authService.setPIN(data);
        return response;
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
            SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
            SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        },
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
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
                if (action.payload.token) {
                    state.token = action.payload.token;
                    SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
                }
            })
            .addCase(setPIN.fulfilled, (state, action) => {
                if (action.payload.success) {
                }
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;