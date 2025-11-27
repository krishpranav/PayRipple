import React, { useState, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { verifyOTP } from '../store/authSlice';
import { AppDispatch } from '../store/store';

type OTPScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OTP'>;

const OTPScreen: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<OTPScreenNavigationProp>();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber: string };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== '') && index === 5) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async (otpValue?: string) => {
        const otpString = otpValue || otp.join('');

        if (otpString.length !== 6) {
            Alert.alert('Error', 'Please enter the 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(verifyOTP({ phoneNumber, otp: otpString })).unwrap();
            if (result.success) {
                if (result.token) {
                    navigation.navigate('SetPin', { phoneNumber });
                } else if (result.isNewUser) {
                    navigation.navigate('SetPin', { phoneNumber });
                }
            } else {
                Alert.alert('Error', result.message || 'Invalid OTP');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
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
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>
                    We've sent a verification code to +91 {phoneNumber}
                </Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={() => handleVerifyOTP()}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
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
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 50,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
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
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resendText: {
        color: '#666',
    },
    resendLink: {
        color: '#6C63FF',
        fontWeight: '600',
    },
});

export default OTPScreen;