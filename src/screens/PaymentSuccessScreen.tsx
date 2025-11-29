import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { PaymentSuccessStackParamList } from '../navigation/types';

type PaymentSuccessScreenNavigationProp = StackNavigationProp<PaymentSuccessStackParamList, 'PaymentSuccess'>;
type PaymentSuccessRouteProp = RouteProp<PaymentSuccessStackParamList, 'PaymentSuccess'>;

const PaymentSuccessScreen: React.FC = () => {
    const navigation = useNavigation<PaymentSuccessScreenNavigationProp>();
    const route = useRoute<PaymentSuccessRouteProp>();

    const { transactionId, amount, receiverName } = route.params;

    const handleGoHome = () => {
        navigation.navigate('HomeMain');
    };

    const handleViewTransactions = () => {
        navigation.navigate('TransactionHistory');
    };

    const handleSendAgain = () => {
        navigation.navigate('SendMoney');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Success Icon */}
                <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                </View>

                {/* Success Message */}
                <View style={styles.messageSection}>
                    <Text style={styles.successTitle}>Payment Successful!</Text>
                    <Text style={styles.successAmount}>₹{amount.toLocaleString('en-IN')}</Text>
                    <Text style={styles.successText}>
                        Your payment to {receiverName} was completed successfully
                    </Text>
                </View>

                {/* Transaction Details */}
                <View style={styles.detailsSection}>
                    <Text style={styles.detailsTitle}>Transaction Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue}>{transactionId}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Amount</Text>
                        <Text style={styles.detailValue}>₹{amount.toLocaleString('en-IN')}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Recipient</Text>
                        <Text style={styles.detailValue}>{receiverName}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Completed</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date & Time</Text>
                        <Text style={styles.detailValue}>
                            {new Date().toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSendAgain}
                    >
                        <Ionicons name="repeat-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>Send Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleViewTransactions}
                    >
                        <Ionicons name="receipt-outline" size={20} color="#6C63FF" />
                        <Text style={styles.secondaryButtonText}>View Transactions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tertiaryButton}
                        onPress={handleGoHome}
                    >
                        <Text style={styles.tertiaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        paddingTop: 60,
    },
    successIcon: {
        alignItems: 'center',
        marginBottom: 30,
    },
    messageSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
        textAlign: 'center',
    },
    successAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 16,
    },
    successText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
    detailsSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666666',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        flex: 1,
        textAlign: 'right',
    },
    statusBadge: {
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4CAF50',
    },
    actionsSection: {
        paddingHorizontal: 20,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#6C63FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#6C63FF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6C63FF',
        marginLeft: 8,
    },
    tertiaryButton: {
        padding: 16,
        alignItems: 'center',
    },
    tertiaryButtonText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '600',
    },
});

export default PaymentSuccessScreen;