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
import { setPIN } from '../store/authSlice';
import { AppDispatch } from '../store/store';

type SetPinScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SetPin'>;

const SetPinScreen: React.FC = () => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const pinInputRefs = useRef<Array<TextInput | null>>([]);
    const confirmPinInputRefs = useRef<Array<TextInput | null>>([]);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<SetPinScreenNavigationProp>();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber: string };

    const handlePinChange = (value: string, index: number, isConfirm = false) => {
        if (value.length > 1) return;

        if (isConfirm) {
            const newConfirmPin = [...confirmPin];
            newConfirmPin[index] = value;
            setConfirmPin(newConfirmPin);

            if (value && index < 3) {
                confirmPinInputRefs.current[index + 1]?.focus();
            }

            if (newConfirmPin.every(digit => digit !== '') && index === 3) {
                handleSetPIN();
            }
        } else {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value && index < 3) {
                pinInputRefs.current[index + 1]?.focus();
            }

            if (newPin.every(digit => digit !== '') && index === 3) {
                setStep(2);
                setTimeout(() => {
                    confirmPinInputRefs.current[0]?.focus();
                }, 100);
            }
        }
    };

    const handleKeyPress = (e: any, index: number, isConfirm = false) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (isConfirm) {
                if (!confirmPin[index] && index > 0) {
                    confirmPinInputRefs.current[index - 1]?.focus();
                }
            } else {
                if (!pin[index] && index > 0) {
                    pinInputRefs.current[index - 1]?.focus();
                }
            }
        }
    };

    const handleSetPIN = async () => {
        const pinString = pin.join('');
        const confirmPinString = confirmPin.join('');

        if (pinString !== confirmPinString) {
            Alert.alert('Error', 'PINs do not match. Please try again.');
            setConfirmPin(['', '', '', '']);
            setStep(1);
            setPin(['', '', '', '']);
            setTimeout(() => {
                pinInputRefs.current[0]?.focus();
            }, 100);
            return;
        }

        if (pinString.length !== 4) {
            Alert.alert('Error', 'Please enter a 4-digit PIN');
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(setPIN({ phoneNumber, pin: pinString })).unwrap();
            if (result.success) {
                Alert.alert('Success', 'PIN set successfully!');
            } else {
                Alert.alert('Error', result.message || 'Failed to set PIN. Please try again.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to set PIN. Please try again.');
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
                <Text style={styles.title}>
                    {step === 1 ? 'Set Security PIN' : 'Confirm PIN'}
                </Text>
                <Text style={styles.subtitle}>
                    {step === 1
                        ? 'Create a 4-digit PIN to secure your account'
                        : 'Please confirm your PIN'
                    }
                </Text>

                <View style={styles.pinContainer}>
                    {(step === 1 ? pin : confirmPin).map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                if (step === 1) {
                                    pinInputRefs.current[index] = ref;
                                } else {
                                    confirmPinInputRefs.current[index] = ref;
                                }
                            }}
                            style={styles.pinInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry
                            value={digit}
                            onChangeText={(value) => handlePinChange(value, index, step === 2)}
                            onKeyPress={(e) => handleKeyPress(e, index, step === 2)}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {step === 2 && (
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSetPIN}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Setting PIN...' : 'Set PIN'}
                        </Text>
                    </TouchableOpacity>
                )}
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
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingHorizontal: 40,
    },
    pinInput: {
        width: 60,
        height: 60,
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
});

export default SetPinScreen;