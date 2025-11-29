import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import BankAccountsScreen from '../screens/BankAccountsScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import QRScanScreen from '../screens/QRScanScreen';
import QRGenerateScreen from '../screens/QRGenerateScreen';
import PaymentConfirmationScreen from '../screens/PaymentConfirmationScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type HomeStackParamList = {
    HomeMain: undefined;
    AddMoney: undefined;
    TransactionHistory: undefined;
    BankAccounts: undefined;
};

const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="HomeMain"
            component={HomeScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="SendMoney"
            component={SendMoneyScreen}
            options={{
                title: 'Send Money',
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        />
        <Stack.Screen
            name="QRScan"
            component={QRScanScreen}
            options={{
                title: 'Scan QR Code',
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        />
        <Stack.Screen
            name="QRGenerate"
            component={QRGenerateScreen}
            options={{
                title: 'Receive Payment',
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        />
        <Stack.Screen
            name="PaymentConfirmation"
            component={PaymentConfirmationScreen}
            options={{
                title: 'Confirm Payment',
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        />
        <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="AddMoney"
            component={AddMoneyScreen}
            options={{
                title: 'Add Money',
                headerStyle: {
                    backgroundColor: '#6C63FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
        <Stack.Screen
            name="TransactionHistory"
            component={TransactionHistoryScreen}
            options={{
                title: 'Transaction History',
                headerStyle: {
                    backgroundColor: '#6C63FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
        <Stack.Screen
            name="BankAccounts"
            component={BankAccountsScreen}
            options={{
                title: 'Bank Accounts',
                headerStyle: {
                    backgroundColor: '#6C63FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    </Stack.Navigator>
);

const TransactionsStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="TransactionsMain"
            component={TransactionHistoryScreen}
            options={{
                title: 'Transaction History',
                headerStyle: {
                    backgroundColor: '#6C63FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    </Stack.Navigator>
);

const BanksStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="BanksMain"
            component={BankAccountsScreen}
            options={{
                title: 'Bank Accounts',
                headerStyle: {
                    backgroundColor: '#6C63FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="ProfileMain"
            component={HomeScreen}
            options={{
                title: 'Profile',
                headerStyle: {
                    backgroundColor: '#6C63FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    </Stack.Navigator>
);

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#6C63FF',
                tabBarInactiveTintColor: '#999999',
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 4,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="TransactionsTab"
                component={TransactionsStack}
                options={{
                    title: 'Transactions',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "receipt" : "receipt-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="BanksTab"
                component={BanksStack}
                options={{
                    title: 'Banks',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "business" : "business-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;