import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AmountInputProps {
    amount: string;
    onAmountChange: (amount: string) => void;
    onQuickAmountSelect: (amount: number) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
    amount,
    onAmountChange,
    onQuickAmountSelect,
}) => {
    const quickAmounts = [100, 500, 1000, 2000];

    const handleAmountChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9.]/g, '');

        const parts = cleanedText.split('.');
        if (parts.length > 2) {
            return;
        }

        if (parts[1] && parts[1].length > 2) {
            return;
        }

        onAmountChange(cleanedText);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter Amount</Text>

            <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={handleAmountChange}
                    placeholderTextColor="#999999"
                    autoFocus
                />
            </View>

            <View style={styles.quickAmounts}>
                {quickAmounts.map((quickAmount) => (
                    <TouchableOpacity
                        key={quickAmount}
                        style={[
                            styles.quickAmountButton,
                            amount === quickAmount.toString() && styles.quickAmountButtonSelected,
                        ]}
                        onPress={() => onQuickAmountSelect(quickAmount)}
                    >
                        <Text
                            style={[
                                styles.quickAmountText,
                                amount === quickAmount.toString() && styles.quickAmountTextSelected,
                            ]}
                        >
                            ₹{quickAmount}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#6C63FF',
        marginBottom: 20,
        paddingBottom: 8,
    },
    currencySymbol: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        paddingVertical: 4,
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickAmountButton: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        minWidth: 80,
        alignItems: 'center',
    },
    quickAmountButtonSelected: {
        backgroundColor: '#6C63FF',
        borderColor: '#6C63FF',
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
    },
    quickAmountTextSelected: {
        color: '#FFFFFF',
    },
});

export default AmountInput;