import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../store/store';
import {
    fetchBankAccounts,
    addBankAccount,
    setDefaultBankAccount,
    removeBankAccount
} from '../store/bankSlice';
import BankAccountCard from '../components/BankAccountCard';
import { Ionicons } from '@expo/vector-icons';
import { BankAccountsScreenNavigationProp } from '../navigation/types';


const BankAccountsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<BankAccountsScreenNavigationProp>();

    const { accounts, isLoading } = useSelector((state: RootState) => state.bank);

    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadBankAccounts();
    }, []);

    const loadBankAccounts = () => {
        dispatch(fetchBankAccounts());
    };

    const handleAddAccount = async () => {
        if (!formData.bankName || !formData.accountNumber || !formData.ifscCode || !formData.accountHolderName) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (formData.accountNumber.length < 9) {
            Alert.alert('Error', 'Please enter a valid account number');
            return;
        }

        if (formData.ifscCode.length !== 11) {
            Alert.alert('Error', 'Please enter a valid 11-character IFSC code');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(addBankAccount(formData)).unwrap();
            setShowAddModal(false);
            setFormData({
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                accountHolderName: '',
            });
            Alert.alert('Success', 'Bank account added successfully');
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to add bank account');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetDefault = async (accountId: string) => {
        try {
            await dispatch(setDefaultBankAccount(accountId)).unwrap();
            Alert.alert('Success', 'Default bank account updated');
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to set default account');
        }
    };

    const handleRemoveAccount = (account: any) => {
        Alert.alert(
            'Remove Bank Account',
            `Are you sure you want to remove ${account.bankName} account?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(removeBankAccount(account.id)).unwrap();
                            Alert.alert('Success', 'Bank account removed successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error || 'Failed to remove bank account');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bottomSpacer}>
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={loadBankAccounts} />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Bank Accounts</Text>
                        <Text style={styles.subtitle}>
                            Manage your linked bank accounts
                        </Text>
                    </View>

                    {/* Bank Accounts List */}
                    {accounts.length > 0 ? (
                        <View style={styles.accountsList}>
                            {accounts.map((account) => (
                                <BankAccountCard
                                    key={account.id}
                                    account={account}
                                    onSetDefault={() => handleSetDefault(account.id)}
                                    onRemove={() => handleRemoveAccount(account)}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="business-outline" size={64} color="#CCCCCC" />
                            <Text style={styles.emptyStateTitle}>No Bank Accounts</Text>
                            <Text style={styles.emptyStateText}>
                                Link your bank account to start adding money to your wallet
                            </Text>
                        </View>
                    )}

                    {/* Add Account Button */}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowAddModal(true)}
                    >
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Add Bank Account</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Add Bank Account Modal */}
                <Modal
                    visible={showAddModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Bank Account</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Bank Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter bank name"
                                    value={formData.bankName}
                                    onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Account Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter account number"
                                    keyboardType="numeric"
                                    value={formData.accountNumber}
                                    onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                                    maxLength={18}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>IFSC Code</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter IFSC code"
                                    value={formData.ifscCode}
                                    onChangeText={(text) => setFormData({ ...formData, ifscCode: text.toUpperCase() })}
                                    autoCapitalize="characters"
                                    maxLength={11}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Account Holder Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter account holder name"
                                    value={formData.accountHolderName}
                                    onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
                                    autoCapitalize="words"
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    isSubmitting && styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddAccount}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isSubmitting ? 'Adding...' : 'Add Bank Account'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

import { RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    accountsList: {
        paddingVertical: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C63FF',
        margin: 20,
        padding: 16,
        borderRadius: 12,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 8,
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
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#F8F9FA',
    },
    submitButton: {
        backgroundColor: '#6C63FF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
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

export default BankAccountsScreen;