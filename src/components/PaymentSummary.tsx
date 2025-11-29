import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentSummaryProps {
    receiverName: string;
    receiverPhone: string;
    amount: number;
    description?: string;
    fee?: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
    receiverName,
    receiverPhone,
    amount,
    description,
    fee = 0,
}) => {
    const totalAmount = amount + fee;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Summary</Text>

            <View style={styles.receiverSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {receiverName ? receiverName.charAt(0).toUpperCase() : receiverPhone.charAt(0)}
                    </Text>
                </View>
                <View style={styles.receiverDetails}>
                    <Text style={styles.receiverName}>{receiverName || 'Unknown Contact'}</Text>
                    <Text style={styles.receiverPhone}>{receiverPhone}</Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.detailValue}>₹{amount.toLocaleString('en-IN')}</Text>
                </View>

                {fee > 0 && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Processing Fee</Text>
                        <Text style={styles.detailValue}>₹{fee.toLocaleString('en-IN')}</Text>
                    </View>
                )}

                <View style={[styles.detailRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
                </View>

                {description && (
                    <View style={styles.descriptionRow}>
                        <Ionicons name="document-text-outline" size={16} color="#666666" />
                        <Text style={styles.descriptionText}>{description}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
    },
    receiverSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    receiverDetails: {
        flex: 1,
    },
    receiverName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    receiverPhone: {
        fontSize: 14,
        color: '#666666',
    },
    details: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: '#666666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    totalRow: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6C63FF',
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    descriptionText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
        flex: 1,
    },
});

export default PaymentSummary;