import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import SetPinScreen from '../screens/SetPinScreen';

export type AuthStackParamList = {
    Login: undefined;
    OTP: { phoneNumber: string };
    SetPin: { phoneNumber: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="SetPin" component={SetPinScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;