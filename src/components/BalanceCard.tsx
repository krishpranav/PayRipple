import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BalanceCardProps {
    balance: number;
    onAddMoney: () => void;
    onViewTransactions: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    onAddMoney,
    onViewTransactions
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>Your Balance</Text>
                <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
                <Text style={styles.balanceSubtext}>Available to spend</Text>
            </View>

            <View style={styles.actionsSection}>
                <TouchableOpacity style={styles.actionButton} onPress={onAddMoney}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="add-circle" size={26} color="#6C63FF" />
                    </View>
                    <Text style={styles.actionText}>Add Money</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onViewTransactions}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="list-circle" size={26} color="#6C63FF" />
                    </View>
                    <Text style={styles.actionText}>History</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    balanceSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    balanceLabel: {
        color: '#666666',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    balanceAmount: {
        color: '#333333',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    balanceSubtext: {
        color: '#999999',
        fontSize: 14,
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    actionText: {
        color: '#666666',
        fontSize: 13,
        fontWeight: '600',
    },
});

export default BalanceCard;