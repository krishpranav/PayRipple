import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BankAccount } from '../types';

interface BankAccountCardProps {
    account: BankAccount;
    isDefault?: boolean;
    onSetDefault?: () => void;
    onRemove?: () => void;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({
    account,
    isDefault = false,
    onSetDefault,
    onRemove
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.bankInfo}>
                    <View style={styles.bankIcon}>
                        <Ionicons name="business" size={20} color="#6C63FF" />
                    </View>
                    <View>
                        <Text style={styles.bankName}>{account.bankName}</Text>
                        <Text style={styles.accountNumber}>•••• {account.accountNumber}</Text>
                    </View>
                </View>

                {account.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}
            </View>

            <View style={styles.details}>
                <Text style={styles.holderName}>{account.accountHolderName}</Text>
                <Text style={styles.ifscCode}>IFSC: {account.ifscCode}</Text>
            </View>

            <View style={styles.footer}>
                {account.isDefault ? (
                    <View style={styles.defaultBadge}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.defaultText}>Default</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.setDefaultButton} onPress={onSetDefault}>
                        <Text style={styles.setDefaultText}>Set as Default</Text>
                    </TouchableOpacity>
                )}

                {!account.isDefault && onRemove && (
                    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                        <Ionicons name="trash-outline" size={16} color="#F44336" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bankInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bankIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    bankName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 2,
    },
    accountNumber: {
        fontSize: 14,
        color: '#666666',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    verifiedText: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: '600',
        marginLeft: 4,
    },
    details: {
        marginBottom: 12,
    },
    holderName: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '600',
        marginBottom: 4,
    },
    ifscCode: {
        fontSize: 12,
        color: '#666666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    defaultText: {
        fontSize: 10,
        color: '#FF9800',
        fontWeight: '600',
        marginLeft: 4,
    },
    setDefaultButton: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    setDefaultText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    removeButton: {
        padding: 4,
    },
});

export default BankAccountCard;