import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Transaction } from '../types';

interface TransactionItemProps {
    transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    const getIconName = (type: string) => {
        switch (type) {
            case 'credit':
                return 'arrow-down-circle';
            case 'debit':
                return 'arrow-up-circle';
            case 'transfer':
                return 'swap-horizontal';
            default:
                return 'card';
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'credit':
                return '#4CAF50';
            case 'debit':
                return '#F44336';
            default:
                return '#FF9800';
        }
    };

    const getAmountColor = (type: string) => {
        return type === 'credit' ? '#4CAF50' : '#333333';
    };

    const getAmountPrefix = (type: string) => {
        return type === 'credit' ? '+' : '-';
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={getIconName(transaction.type)}
                    size={24}
                    color={getIconColor(transaction.type)}
                />
            </View>

            <View style={styles.details}>
                <Text style={styles.description}>{transaction.description}</Text>
                <Text style={styles.date}>
                    {format(new Date(transaction.createdAt), 'MMM dd, yyyy • hh:mm a')}
                </Text>
                <Text style={styles.reference}>Ref: {transaction.referenceId}</Text>
            </View>

            <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: getAmountColor(transaction.type) }]}>
                    {getAmountPrefix(transaction.type)}₹{transaction.amount.toLocaleString('en-IN')}
                </Text>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: transaction.status === 'success' ? '#E8F5E8' : '#FFEBEE' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: transaction.status === 'success' ? '#4CAF50' : '#F44336' }
                    ]}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 2,
    },
    reference: {
        fontSize: 11,
        color: '#999999',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
});

export default TransactionItem;