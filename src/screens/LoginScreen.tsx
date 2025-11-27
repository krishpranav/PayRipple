import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { sendOTP } from '../store/authSlice';
import { AppDispatch } from '../store/store';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleSendOTP = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(sendOTP(phoneNumber)).unwrap();
            if (result.success) {
                navigation.navigate('OTP', { phoneNumber });
            } else {
                Alert.alert('Error', result.message || 'Failed to send OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text style={styles.title}>PayRipple</Text>
                <Text style={styles.subtitle}>Welcome to Secure Payments</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.phoneInput}>
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            maxLength={10}
                            autoFocus
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSendOTP}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.terms}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6C63FF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 50,
    },
    inputContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    phoneInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 15,
    },
    button: {
        backgroundColor: '#6C63FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    terms: {
        fontSize: 12,
        textAlign: 'center',
        color: '#666',
        lineHeight: 16,
    },
});

export default LoginScreen;