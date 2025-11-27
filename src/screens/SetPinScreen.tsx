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
    const [originalPin, setOriginalPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Set PIN, 2: Confirm PIN

    const originalInputRef = useRef<TextInput>(null);
    const confirmInputRef = useRef<TextInput>(null);

    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<SetPinScreenNavigationProp>();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber: string };

    // Handle original PIN input
    const handleOriginalPinChange = (text: string) => {
        // Only allow numbers and limit to 4 digits
        const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 4);
        setOriginalPin(cleanedText);

        // Auto-advance to confirm when 4 digits are entered
        if (cleanedText.length === 4) {
            setTimeout(() => {
                setStep(2);
                confirmInputRef.current?.focus();
            }, 300);
        }
    };

    // Handle confirm PIN input
    const handleConfirmPinChange = (text: string) => {
        // Only allow numbers and limit to 4 digits
        const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 4);
        setConfirmPin(cleanedText);
    };

    const handleSetPIN = async () => {
        console.log('PIN Comparison:', {
            originalPIN: originalPin,
            confirmPIN: confirmPin,
            areEqual: originalPin === confirmPin
        });

        if (originalPin.length !== 4 || confirmPin.length !== 4) {
            Alert.alert('Error', 'Please enter complete 4-digit PINs');
            return;
        }

        if (originalPin !== confirmPin) {
            Alert.alert('Error', 'PINs do not match. Please try again.');
            setConfirmPin('');
            confirmInputRef.current?.focus();
            return;
        }

        console.log('Setting PIN for:', phoneNumber, 'PIN:', originalPin);

        setIsLoading(true);
        try {
            const result = await dispatch(setPIN({ phoneNumber, pin: originalPin })).unwrap();
            console.log('Set PIN result:', result);

            if (result.success) {
                Alert.alert('Success', 'PIN set successfully!');
                // TODO: Navigate to home screen
            } else {
                Alert.alert('Error', result.message || 'Failed to set PIN. Please try again.');
            }
        } catch (error: any) {
            console.log('Set PIN error:', error);
            Alert.alert('Error', error.message || 'Failed to set PIN. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderPinDots = (pin: string) => {
        return (
            <View style={styles.dotsContainer}>
                {[0, 1, 2, 3].map((index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index < pin.length ? styles.dotFilled : styles.dotEmpty
                        ]}
                    />
                ))}
            </View>
        );
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

                {/* PIN Display */}
                <View style={styles.pinDisplay}>
                    {step === 1 ? renderPinDots(originalPin) : renderPinDots(confirmPin)}
                </View>

                {/* Hidden TextInput for PIN entry */}
                <TextInput
                    ref={step === 1 ? originalInputRef : confirmInputRef}
                    style={styles.hiddenInput}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    value={step === 1 ? originalPin : confirmPin}
                    onChangeText={step === 1 ? handleOriginalPinChange : handleConfirmPinChange}
                    autoFocus
                />

                {step === 2 && confirmPin.length === 4 && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleSetPIN}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Setting PIN...' : 'Set PIN'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                setStep(1);
                                setConfirmPin('');
                                setTimeout(() => {
                                    originalInputRef.current?.focus();
                                }, 100);
                            }}
                        >
                            <Text style={styles.backButtonText}>Back to Change PIN</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Instructions */}
                <View style={styles.instructions}>
                    <Text style={styles.instructionsText}>
                        {step === 1
                            ? 'Enter 4-digit PIN'
                            : 'Confirm your 4-digit PIN'
                        }
                    </Text>
                </View>
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
    pinDisplay: {
        alignItems: 'center',
        marginBottom: 40,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    dotEmpty: {
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    dotFilled: {
        backgroundColor: '#6C63FF',
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        backgroundColor: '#6C63FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        color: '#6C63FF',
        fontSize: 14,
    },
    instructions: {
        alignItems: 'center',
        marginTop: 30,
    },
    instructionsText: {
        color: '#666',
        fontSize: 14,
    },
});

export default SetPinScreen;