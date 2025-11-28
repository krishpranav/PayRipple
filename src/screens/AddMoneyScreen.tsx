import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../store/store';
import { walletService } from '../services/walletService';
import { fetchWalletBalance, updateWalletBalance } from '../store/authSlice';
import { addTransaction } from '../store/walletSlice';
import { Ionicons } from '@expo/vector-icons';
import { AddMoneyScreenNavigationProp } from '../navigation/types'; // Import the type
import { SafeAreaView } from 'react-native-safe-area-context';

const AddMoneyScreen: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<AddMoneyScreenNavigationProp>();

    const { wallet } = useSelector((state: RootState) => state.auth);
    const { accounts } = useSelector((state: RootState) => state.bank);

    useEffect(() => {
        loadBankAccounts();
    }, []);

    const loadBankAccounts = async () => {
        try {
            if (accounts.length > 0) {
                setBankAccounts(accounts);
                const defaultAccount = accounts.find(acc => acc.isDefault);
                if (defaultAccount) {
                    setSelectedAccount(defaultAccount);
                } else if (accounts.length > 0) {
                    setSelectedAccount(accounts[0]);
                }
            }
        } catch (error) {
            console.error('Error loading bank accounts:', error);
        }
    };

    const quickAmounts = [100, 500, 1000, 2000, 5000];

    const handleQuickAmountSelect = (quickAmount: number) => {
        setAmount(quickAmount.toString());
    };

    const handleAddMoney = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (!selectedAccount) {
            Alert.alert('Error', 'Please select a bank account');
            return;
        }

        const amountValue = parseFloat(amount);

        if (amountValue < 100) {
            Alert.alert('Error', 'Minimum amount is ₹100');
            return;
        }

        if (amountValue > 50000) {
            Alert.alert('Error', 'Maximum amount is ₹50,000');
            return;
        }

        setIsLoading(true);
        try {
            const response = await walletService.addMoney({
                amount: amountValue,
                bankAccountId: selectedAccount.id,
            });

            if (response.success) {
                dispatch(updateWalletBalance(response.data.newBalance));
                dispatch(addTransaction(response.data.transaction));

                Alert.alert('Success', response.message, [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to add money');
            }
        } catch (error: any) {
            console.error('Add money error:', error);
            Alert.alert('Error', error.message || 'Failed to add money. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageAccounts = () => {
        navigation.navigate('BankAccounts');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bottomSpacer}>
                <StatusBar backgroundColor="#6C63FF" barStyle="light-content" />

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Current Balance */}
                        <View style={styles.balanceSection}>
                            <Text style={styles.balanceLabel}>Current Balance</Text>
                            <Text style={styles.balanceAmount}>₹{wallet?.balance?.toLocaleString('en-IN') || '0'}</Text>
                        </View>

                        {/* Amount Input */}
                        <View style={styles.amountSection}>
                            <Text style={styles.sectionTitle}>Enter Amount</Text>
                            <View style={styles.amountInputContainer}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Quick Amounts */}
                            <View style={styles.quickAmounts}>
                                {quickAmounts.map((quickAmount) => (
                                    <TouchableOpacity
                                        key={quickAmount}
                                        style={[
                                            styles.quickAmountButton,
                                            amount === quickAmount.toString() && styles.quickAmountButtonSelected,
                                        ]}
                                        onPress={() => handleQuickAmountSelect(quickAmount)}
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

                        {/* Bank Account Selection */}
                        <View style={styles.bankSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Bank Account</Text>
                                <TouchableOpacity onPress={handleManageAccounts}>
                                    <Text style={styles.manageText}>Manage</Text>
                                </TouchableOpacity>
                            </View>

                            {selectedAccount ? (
                                <View style={styles.selectedAccount}>
                                    <View style={styles.bankInfo}>
                                        <View style={styles.bankIcon}>
                                            <Ionicons name="business" size={20} color="#6C63FF" />
                                        </View>
                                        <View style={styles.bankDetails}>
                                            <Text style={styles.bankName}>{selectedAccount.bankName}</Text>
                                            <Text style={styles.accountNumber}>
                                                •••• {selectedAccount.accountNumber}
                                                {selectedAccount.isDefault && (
                                                    <Text style={styles.defaultBadge}> • Default</Text>
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-down" size={20} color="#666" />
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.addAccountButton} onPress={handleManageAccounts}>
                                    <Ionicons name="add-circle-outline" size={24} color="#6C63FF" />
                                    <Text style={styles.addAccountText}>Add Bank Account</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Add Money Button */}
                        <TouchableOpacity
                            style={[
                                styles.addMoneyButton,
                                (!amount || !selectedAccount || isLoading) && styles.addMoneyButtonDisabled,
                            ]}
                            onPress={handleAddMoney}
                            disabled={!amount || !selectedAccount || isLoading}
                        >
                            <Text style={styles.addMoneyButtonText}>
                                {isLoading ? 'Adding Money...' : 'Add Money'}
                            </Text>
                        </TouchableOpacity>

                        {/* Info Section */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoItem}>
                                <Ionicons name="time-outline" size={16} color="#666" />
                                <Text style={styles.infoText}>Usually credited instantly</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="information-circle-outline" size={16} color="#666" />
                                <Text style={styles.infoText}>No additional charges</Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    bottomSpacer: {
        height: 80,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    balanceSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 20,
        borderRadius: 16,
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
        color: '#666',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    amountSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 12,
        marginHorizontal: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#6C63FF',
        marginBottom: 20,
    },
    currencySymbol: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 8,
    },
    quickAmounts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickAmountButton: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    quickAmountButtonSelected: {
        backgroundColor: '#6C63FF',
        borderColor: '#6C63FF',
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    quickAmountTextSelected: {
        color: '#FFFFFF',
    },
    bankSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 12,
        marginHorizontal: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    manageText: {
        fontSize: 14,
        color: '#6C63FF',
        fontWeight: '600',
    },
    selectedAccount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
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
    bankDetails: {
        flex: 1,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    accountNumber: {
        fontSize: 14,
        color: '#666',
    },
    defaultBadge: {
        color: '#6C63FF',
        fontWeight: '600',
    },
    addAccountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    addAccountText: {
        fontSize: 16,
        color: '#6C63FF',
        fontWeight: '600',
        marginLeft: 8,
    },
    addMoneyButton: {
        backgroundColor: '#6C63FF',
        marginHorizontal: 20,
        marginTop: 24,
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
    addMoneyButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    addMoneyButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    infoSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
});

export default AddMoneyScreen;