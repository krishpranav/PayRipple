import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    HomeTab: undefined;
    TransactionsTab: undefined;
    BanksTab: undefined;
    ProfileTab: undefined;
    AddMoney: undefined;
    TransactionHistory: undefined;
    BankAccounts: undefined;
};

export type HomeStackParamList = {
    HomeMain: undefined;
    AddMoney: undefined;
    TransactionHistory: undefined;
    BankAccounts: undefined;
};

export type TransactionsStackParamList = {
    TransactionsMain: undefined;
};

export type BanksStackParamList = {
    BanksMain: undefined;
};

export type ProfileStackParamList = {
    ProfileMain: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;
export type AddMoneyScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'AddMoney'>;
export type TransactionHistoryScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'TransactionHistory'>;
export type BankAccountsScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BankAccounts'>;