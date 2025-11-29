import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState, AppDispatch } from '../store/store';
import { sendMoney } from '../store/p2pSlice';
import { updateWalletBalance } from '../store/authSlice';
import { addTransaction } from '../store/walletSlice';
import PaymentSummary from '../components/PaymentSummary';
import { Ionicons } from '@expo/vector-icons';

type PaymentConfirmationStackParamList = {
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

type PaymentConfirmationScreenNavigationProp = StackNavigationProp<PaymentConfirmationStackParamList, 'PaymentConfirmation'>;
type PaymentConfirmationRouteProp = RouteProp<PaymentConfirmationStackParamList, 'PaymentConfirmation'>;

const PaymentConfirmationScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<PaymentConfirmationScreenNavigationProp>();
    const route = useRoute<PaymentConfirmationRouteProp>();

    const { receiverPhone, receiverName, amount, description } = route.params;
    const { isLoading } = useSelector((state: RootState) => state.p2p);
    const { wallet } = useSelector((state: RootState) => state.auth);

    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirmPayment = () => {
        setShowPinModal(true);
    };

    const handlePinSubmit = async () => {
        if (pin.length !== 4) {
            Alert.alert('Error', 'Please enter a 4-digit PIN');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await dispatch(sendMoney({
                receiverPhone,
                amount,
                description,
                pin,
            })).unwrap();

            dispatch(updateWalletBalance(result.newBalance));

            navigation.replace('PaymentSuccess', {
                transactionId: result.transfer.referenceId,
                amount: result.transfer.amount,
                receiverName: result.transfer.receiverName,
            });

        } catch (error: any) {
            Alert.alert('Error', error || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
            setShowPinModal(false);
            setPin('');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#6C63FF" barStyle="light-content" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                    <Text style={styles.headerTitle}>Confirm Payment</Text>
                    <Text style={styles.headerSubtitle}>
                        Please review the payment details before confirming
                    </Text>
                </View>

                {/* Payment Summary */}
                <PaymentSummary
                    receiverName={receiverName}
                    receiverPhone={receiverPhone}
                    amount={amount}
                    description={description}
                />

                {/* Current Balance */}
                <View style={styles.balanceSection}>
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Text style={styles.balanceAmount}>₹{wallet?.balance?.toLocaleString('en-IN') || '0'}</Text>
                    <Text style={styles.balanceAfter}>
                        After payment: ₹{((wallet?.balance || 0) - amount).toLocaleString('en-IN')}
                    </Text>
                </View>

                {/* Security Info */}
                <View style={styles.securitySection}>
                    <View style={styles.securityItem}>
                        <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                        <Text style={styles.securityText}>Secured by PayRipple</Text>
                    </View>
                    <View style={styles.securityItem}>
                        <Ionicons name="lock-closed" size={20} color="#4CAF50" />
                        <Text style={styles.securityText}>End-to-end encrypted</Text>
                    </View>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    style={[styles.confirmButton, (isLoading || isProcessing) && styles.confirmButtonDisabled]}
                    onPress={handleConfirmPayment}
                    disabled={isLoading || isProcessing}
                >
                    <Text style={styles.confirmButtonText}>
                        {isProcessing ? 'Processing...' : `Send ₹${amount.toLocaleString('en-IN')}`}
                    </Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* PIN Modal */}
            <Modal
                visible={showPinModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowPinModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Enter Security PIN</Text>
                        <TouchableOpacity onPress={() => setShowPinModal(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.modalSubtitle}>
                            Enter your 4-digit PIN to confirm payment of ₹{amount.toLocaleString('en-IN')}
                        </Text>

                        <View style={styles.pinInputContainer}>
                            <TextInput
                                style={styles.pinInput}
                                keyboardType="number-pad"
                                secureTextEntry
                                maxLength={4}
                                value={pin}
                                onChangeText={setPin}
                                autoFocus
                            />
                        </View>

                        <View style={styles.pinDots}>
                            {[0, 1, 2, 3].map(index => (
                                <View
                                    key={index}
                                    style={[
                                        styles.pinDot,
                                        index < pin.length ? styles.pinDotFilled : styles.pinDotEmpty,
                                    ]}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, pin.length !== 4 && styles.submitButtonDisabled]}
                            onPress={handlePinSubmit}
                            disabled={pin.length !== 4 || isProcessing}
                        >
                            <Text style={styles.submitButtonText}>
                                {isProcessing ? 'Processing...' : 'Confirm Payment'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 16,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
    balanceSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    balanceAfter: {
        fontSize: 14,
        color: '#666666',
    },
    securitySection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    securityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    securityText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 12,
    },
    confirmButton: {
        backgroundColor: '#6C63FF',
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    confirmButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    confirmButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    bottomSpacer: {
        height: 30,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    pinInputContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    pinInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    pinDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        gap: 20,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    pinDotEmpty: {
        backgroundColor: '#F0F0F0',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    pinDotFilled: {
        backgroundColor: '#6C63FF',
    },
    submitButton: {
        backgroundColor: '#6C63FF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default PaymentConfirmationScreen;