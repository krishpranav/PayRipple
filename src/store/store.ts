import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import walletReducer from './walletSlice';
import bankReducer from './bankSlice';
import p2pReducer from './p2pSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        wallet: walletReducer,
        bank: bankReducer,
        p2p: p2pReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;