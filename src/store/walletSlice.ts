import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../types';
import { walletService } from '../services/walletService';

interface WalletState {
    transactions: Transaction[];
    isLoading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalTransactions: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

const initialState: WalletState = {
    transactions: [],
    isLoading: false,
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalTransactions: 0,
        hasNext: false,
        hasPrev: false,
    },
};

export const fetchTransactions = createAsyncThunk(
    'wallet/fetchTransactions',
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const response = await walletService.getTransactions(page, limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            state.transactions.unshift(action.payload);
        },
        clearTransactions: (state) => {
            state.transactions = [];
            state.pagination = initialState.pagination;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload.transactions;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchTransactions.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { addTransaction, clearTransactions } = walletSlice.actions;
export default walletSlice.reducer;