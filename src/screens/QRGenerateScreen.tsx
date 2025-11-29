import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Share,
    Alert,
    StatusBar,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from '../store/store';
import { qrService } from '../services/qrService';
import { Ionicons } from '@expo/vector-icons';

type QRGenerateStackParamList = {
    QRGenerate: undefined;
};

type QRGenerateScreenNavigationProp = StackNavigationProp<QRGenerateStackParamList, 'QRGenerate'>;

const QRGenerateScreen: React.FC = () => {
    const navigation = useNavigation<QRGenerateScreenNavigationProp>();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        generateQRCode();
    }, []);

    const generateQRCode = async (customAmount?: string, customDescription?: string) => {
        setIsLoading(true);
        try {
            const amountValue = customAmount ? parseFloat(customAmount) : undefined;
            const descriptionValue = customDescription || description;

            const response = await qrService.generateQRCode(amountValue, descriptionValue);
            setQrCode(response.data.qrCode);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate QR code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareQR = async () => {
        if (!qrCode) return;

        try {
            await Share.share({
                message: `Scan this QR code to pay me ${amount ? '₹' + amount : ''} via PayRipple`,
                url: qrCode,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share QR code');
        }
    };

    const handleGenerateWithAmount = () => {
        if (amount && parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        generateQRCode(amount, description);
    };

    const quickAmounts = [100, 500, 1000, 2000];

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
                    <Text style={styles.title}>Receive Payment</Text>
                    <Text style={styles.subtitle}>
                        Share your QR code to receive payments instantly
                    </Text>
                </View>

                {/* QR Code Display */}
                <View style={styles.qrSection}>
                    {qrCode ? (
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={JSON.stringify({
                                    type: 'payment_request',
                                    upiId: `${user?.phoneNumber}@payripple`,
                                    amount: amount ? parseFloat(amount) : 0,
                                    description: description || 'Payment Request',
                                    merchant: user?.name || user?.phoneNumber,
                                    timestamp: new Date().toISOString(),
                                })}
                                size={200}
                                logoBackgroundColor="transparent"
                            />
                        </View>
                    ) : (
                        <View style={styles.qrPlaceholder}>
                            <Ionicons name="qr-code-outline" size={64} color="#CCCCCC" />
                            <Text style={styles.qrPlaceholderText}>
                                {isLoading ? 'Generating QR Code...' : 'QR Code will appear here'}
                            </Text>
                        </View>
                    )}

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                        <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
                        {amount && (
                            <Text style={styles.amountText}>₹{parseFloat(amount).toLocaleString('en-IN')}</Text>
                        )}
                    </View>
                </View>

                {/* Amount Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.sectionTitle}>Set Amount (Optional)</Text>

                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0"
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                            placeholderTextColor="#999999"
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
                                onPress={() => setAmount(quickAmount.toString())}
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

                {/* Description Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.sectionTitle}>Description (Optional)</Text>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="e.g., Lunch payment, Services, etc."
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#999999"
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
                        onPress={handleGenerateWithAmount}
                        disabled={isLoading}
                    >
                        <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.generateButtonText}>
                            {isLoading ? 'Generating...' : 'Update QR Code'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={handleShareQR}
                        disabled={!qrCode}
                    >
                        <Ionicons name="share-outline" size={20} color="#6C63FF" />
                        <Text style={styles.shareButtonText}>Share QR Code</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                        <Ionicons name="information-circle-outline" size={16} color="#666666" />
                        <Text style={styles.infoText}>
                            Anyone can scan this QR code to pay you instantly
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={16} color="#666666" />
                        <Text style={styles.infoText}>
                            Payments are credited to your wallet immediately
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomSpacer} />
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
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
    qrSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    qrContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 20,
    },
    qrPlaceholder: {
        width: 240,
        height: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    qrPlaceholderText: {
        fontSize: 14,
        color: '#999999',
        marginTop: 12,
        textAlign: 'center',
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 8,
    },
    amountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6C63FF',
    },
    inputSection: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#6C63FF',
        marginBottom: 20,
        paddingBottom: 8,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
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
    descriptionInput: {
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
    },
    actionsSection: {
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    generateButton: {
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
    generateButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    shareButton: {
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
    shareButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6C63FF',
        marginLeft: 8,
    },
    infoSection: {
        paddingHorizontal: 20,
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 30,
    },
});

export default QRGenerateScreen;