import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    OTP: { phoneNumber: string };
    SetPin: { phoneNumber: string };
    HomeMain: undefined;
    AddMoney: undefined;
    TransactionHistory: undefined;
    BankAccounts: undefined;
    SendMoney: undefined;
    RequestMoney: undefined;
    QRScan: undefined;
    QRGenerate: undefined;
    PaymentConfirmation: {
        receiverPhone: string;
        receiverName: string;
        amount: number;
        description?: string;
    };
    PaymentSuccess: {
        transactionId: string;
        amount: number;
        receiverName: string;
    };
};

export type HomeStackParamList = {
    HomeMain: undefined;
    AddMoney: undefined;
    TransactionHistory: undefined;
    BankAccounts: undefined;
    SendMoney: undefined;
    QRScan: undefined;
    QRGenerate: undefined;
    PaymentConfirmation: {
        receiverPhone: string;
        receiverName: string;
        amount: number;
        description?: string;
    };
    PaymentSuccess: {
        transactionId: string;
        amount: number;
        receiverName: string;
    };
};

export type SendMoneyStackParamList = {
    SendMoney: undefined;
    PaymentConfirmation: {
        receiverPhone: string;
        receiverName: string;
        amount: number;
        description?: string;
    };
    PaymentSuccess: {
        transactionId: string;
        amount: number;
        receiverName: string;
    };
};

export type QRScanStackParamList = {
    QRScan: undefined;
    PaymentConfirmation: {
        receiverPhone: string;
        receiverName: string;
        amount: number;
        description?: string;
    };
    SendMoney: undefined;
};

export type PaymentConfirmationStackParamList = {
    PaymentConfirmation: {
        receiverPhone: string;
        receiverName: string;
        amount: number;
        description?: string;
    };
    PaymentSuccess: {
        transactionId: string;
        amount: number;
        receiverName: string;
    };
};

export type PaymentSuccessStackParamList = {
    PaymentSuccess: {
        transactionId: string;
        amount: number;
        receiverName: string;
    };
    HomeMain: undefined;
    TransactionHistory: undefined;
    SendMoney: undefined;
};

export type QRGenerateStackParamList = {
    QRGenerate: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;
export type SendMoneyScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'SendMoney'>;
export type QRScanScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'QRScan'>;
export type QRGenerateScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'QRGenerate'>;
export type PaymentConfirmationScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PaymentConfirmation'>;
export type PaymentSuccessScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PaymentSuccess'>;