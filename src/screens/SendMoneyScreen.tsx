import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState, AppDispatch } from '../store/store';
import { sendMoney } from '../store/p2pSlice';
import { updateWalletBalance } from '../store/authSlice';
import { addTransaction } from '../store/walletSlice';
import ContactItem from '../components/ContactItem';
import AmountInput from '../components/AmountInput';
import PaymentSummary from '../components/PaymentSummary';
import { Ionicons } from '@expo/vector-icons';

type SendMoneyStackParamList = {
    SendMoney: undefined;
    PaymentConfirmation: {
        receiverPhone: string;
        receiverName: string;
        amount: number;
        description?: string;
    };
};

type SendMoneyScreenNavigationProp = StackNavigationProp<SendMoneyStackParamList, 'SendMoney'>;

const mockContacts = [
    { id: '1', name: 'John Doe', phone: '9876543210' },
    { id: '2', name: 'Jane Smith', phone: '9876543211' },
    { id: '3', name: 'Bob Johnson', phone: '9876543212' },
    { id: '4', name: 'Alice Brown', phone: '9876543213' },
];

const SendMoneyScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<SendMoneyScreenNavigationProp>();

    const { wallet } = useSelector((state: RootState) => state.auth);
    const { isLoading } = useSelector((state: RootState) => state.p2p);

    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = mockContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
    );

    const handleContactSelect = (contact: any) => {
        setSelectedContact(contact);
        setSearchQuery('');
    };

    const handleQuickAmountSelect = (quickAmount: number) => {
        setAmount(quickAmount.toString());
    };

    const handleContinue = () => {
        if (!selectedContact) {
            Alert.alert('Error', 'Please select a contact to send money to');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        const amountValue = parseFloat(amount);

        if (amountValue < 1) {
            Alert.alert('Error', 'Minimum amount is ₹1');
            return;
        }

        if (wallet && wallet.balance < amountValue) {
            Alert.alert('Error', 'Insufficient balance');
            return;
        }

        navigation.navigate('PaymentConfirmation', {
            receiverPhone: selectedContact.phone,
            receiverName: selectedContact.name,
            amount: amountValue,
            description: description || undefined,
        });
    };

    const handleManualEntry = () => {
        Alert.prompt(
            'Enter Phone Number',
            'Enter the 10-digit phone number to send money',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Continue',
                    onPress: (phone: string | undefined) => {
                        if (phone && phone.length === 10 && /^\d+$/.test(phone)) {
                            setSelectedContact({
                                id: 'manual',
                                name: '',
                                phone: phone,
                            });
                        } else {
                            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
                        }
                    },
                },
            ],
            'plain-text'
        );
    };

    return (
        <View style={styles.container}>
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
                    {/* Search/Manual Entry */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#999999" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search contacts or enter phone number"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#999999"
                            />
                        </View>
                        <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry}>
                            <Ionicons name="person-add-outline" size={20} color="#6C63FF" />
                            <Text style={styles.manualButtonText}>Manual</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Selected Contact */}
                    {selectedContact && (
                        <View style={styles.selectedContact}>
                            <Text style={styles.selectedLabel}>Sending to:</Text>
                            <ContactItem
                                contact={selectedContact}
                                onPress={() => setSelectedContact(null)}
                                showArrow={false}
                            />
                        </View>
                    )}

                    {/* Amount Input */}
                    {selectedContact && (
                        <AmountInput
                            amount={amount}
                            onAmountChange={setAmount}
                            onQuickAmountSelect={handleQuickAmountSelect}
                        />
                    )}

                    {/* Description Input */}
                    {selectedContact && amount && (
                        <View style={styles.descriptionSection}>
                            <Text style={styles.label}>Add a note (optional)</Text>
                            <TextInput
                                style={styles.descriptionInput}
                                placeholder="What's this payment for?"
                                value={description}
                                onChangeText={setDescription}
                                placeholderTextColor="#999999"
                                multiline
                            />
                        </View>
                    )}

                    {/* Payment Summary */}
                    {selectedContact && amount && parseFloat(amount) > 0 && (
                        <PaymentSummary
                            receiverName={selectedContact.name}
                            receiverPhone={selectedContact.phone}
                            amount={parseFloat(amount)}
                            description={description}
                        />
                    )}

                    {/* Contacts List */}
                    {!selectedContact && searchQuery && (
                        <View style={styles.contactsSection}>
                            <Text style={styles.sectionTitle}>Search Results</Text>
                            {filteredContacts.map(contact => (
                                <ContactItem
                                    key={contact.id}
                                    contact={contact}
                                    onPress={handleContactSelect}
                                />
                            ))}
                            {filteredContacts.length === 0 && (
                                <Text style={styles.noResults}>No contacts found</Text>
                            )}
                        </View>
                    )}

                    {!selectedContact && !searchQuery && (
                        <View style={styles.contactsSection}>
                            <Text style={styles.sectionTitle}>Recent Contacts</Text>
                            {mockContacts.map(contact => (
                                <ContactItem
                                    key={contact.id}
                                    contact={contact}
                                    onPress={handleContactSelect}
                                />
                            ))}
                        </View>
                    )}

                    {/* Continue Button */}
                    {selectedContact && amount && parseFloat(amount) > 0 && (
                        <TouchableOpacity
                            style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
                            onPress={handleContinue}
                            disabled={isLoading}
                        >
                            <Text style={styles.continueButtonText}>
                                {isLoading ? 'Processing...' : 'Continue'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </KeyboardAvoidingView>
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
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        marginLeft: 8,
    },
    manualButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    manualButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6C63FF',
        marginLeft: 4,
    },
    selectedContact: {
        marginBottom: 20,
    },
    selectedLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
        marginLeft: 20,
        marginBottom: 8,
    },
    descriptionSection: {
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
        marginBottom: 12,
    },
    descriptionInput: {
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    contactsSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    noResults: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 16,
        marginTop: 20,
    },
    continueButton: {
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
    continueButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    bottomSpacer: {
        height: 30,
    },
});

export default SendMoneyScreen;