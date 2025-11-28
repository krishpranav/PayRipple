import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { P2PTransfer } from '../types';
import { p2pService } from '../services/p2pService';

interface P2PState {
    transfers: P2PTransfer[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalTransfers: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

const initialState: P2PState = {
    transfers: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalTransfers: 0,
        hasNext: false,
        hasPrev: false,
    },
};

export const sendMoney = createAsyncThunk(
    'p2p/sendMoney',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await p2pService.sendMoney(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send money');
        }
    }
);

export const fetchP2PHistory = createAsyncThunk(
    'p2p/fetchP2PHistory',
    async ({ page, limit, type }: { page: number; limit: number; type: string }, { rejectWithValue }) => {
        try {
            const response = await p2pService.getP2PHistory(page, limit, type);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch P2P history');
        }
    }
);

const p2pSlice = createSlice({
    name: 'p2p',
    initialState,
    reducers: {
        clearP2PState: (state) => {
            state.transfers = [];
            state.error = null;
            state.pagination = initialState.pagination;
        },
        addTransfer: (state, action: PayloadAction<P2PTransfer>) => {
            state.transfers.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMoney.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMoney.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(sendMoney.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchP2PHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchP2PHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transfers = action.payload.transfers;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchP2PHistory.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { clearP2PState, addTransfer } = p2pSlice.actions;
export default p2pSlice.reducer;