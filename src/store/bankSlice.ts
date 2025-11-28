import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BankAccount } from '../types';
import { bankService } from '../services/bankService';

interface BankState {
    accounts: BankAccount[];
    isLoading: boolean;
}

const initialState: BankState = {
    accounts: [],
    isLoading: false,
};

export const fetchBankAccounts = createAsyncThunk(
    'bank/fetchBankAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await bankService.getAccounts();
            return response.data.bankAccounts;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bank accounts');
        }
    }
);

export const addBankAccount = createAsyncThunk(
    'bank/addBankAccount',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await bankService.addAccount(data);
            return response.data.bankAccount;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add bank account');
        }
    }
);

export const setDefaultBankAccount = createAsyncThunk(
    'bank/setDefaultBankAccount',
    async (accountId: string, { rejectWithValue }) => {
        try {
            const response = await bankService.setDefaultAccount(accountId);
            return { accountId, message: response.message };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to set default account');
        }
    }
);

export const removeBankAccount = createAsyncThunk(
    'bank/removeBankAccount',
    async (accountId: string, { rejectWithValue }) => {
        try {
            const response = await bankService.removeAccount(accountId);
            return { accountId, message: response.message };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove bank account');
        }
    }
);

const bankSlice = createSlice({
    name: 'bank',
    initialState,
    reducers: {
        clearAccounts: (state) => {
            state.accounts = [];
        },
        updateAccountAsDefault: (state, action: PayloadAction<string>) => {
            state.accounts.forEach(account => {
                account.isDefault = false;
            });

            const account = state.accounts.find(acc => acc.id === action.payload);
            if (account) {
                account.isDefault = true;
            }
        },
        removeAccountFromState: (state, action: PayloadAction<string>) => {
            state.accounts = state.accounts.filter(account => account.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankAccounts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBankAccounts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accounts = action.payload;
            })
            .addCase(fetchBankAccounts.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(addBankAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload);
            })
            .addCase(setDefaultBankAccount.fulfilled, (state, action) => {
                state.accounts.forEach(account => {
                    account.isDefault = false;
                });

                const account = state.accounts.find(acc => acc.id === action.payload.accountId);
                if (account) {
                    account.isDefault = true;
                }
            })

            .addCase(removeBankAccount.fulfilled, (state, action) => {
                state.accounts = state.accounts.filter(account => account.id !== action.payload.accountId);
            });
    },
});

export const { clearAccounts, updateAccountAsDefault, removeAccountFromState } = bankSlice.actions;
export default bankSlice.reducer;