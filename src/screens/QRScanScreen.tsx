import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    StatusBar,
    Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { QRScanStackParamList } from '../navigation/types';

type QRScanScreenNavigationProp = StackNavigationProp<QRScanStackParamList, 'QRScan'>;

const { width, height } = Dimensions.get('window');

const QRScanScreen: React.FC = () => {
    const navigation = useNavigation<QRScanScreenNavigationProp>();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);

        try {
            const qrData = JSON.parse(data);

            if (qrData.type === 'payment_request') {
                // Extract phone number from UPI ID (assuming format: phone@payripple)
                const phone = qrData.upiId.split('@')[0];

                navigation.navigate('PaymentConfirmation', {
                    receiverPhone: phone,
                    receiverName: qrData.merchant,
                    amount: qrData.amount || 0,
                    description: qrData.description,
                });
            } else {
                Alert.alert('Error', 'Invalid QR code. Please scan a PayRipple payment QR code.');
                setScanned(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Invalid QR code format. Please try again.');
            setScanned(false);
        }
    };

    const handleManualEntry = () => {
        navigation.navigate('SendMoney');
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={64} color="#666666" />
                <Text style={styles.permissionTitle}>Camera Access Required</Text>
                <Text style={styles.permissionText}>
                    PayRipple needs camera access to scan QR codes for payments
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000000" barStyle="light-content" />

            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            >
                {/* Overlay */}
                <View style={styles.overlay}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <Text style={styles.title}>Scan QR Code</Text>
                        <Text style={styles.subtitle}>
                            Position the QR code within the frame to scan
                        </Text>
                    </View>

                    {/* Scanner Frame */}
                    <View style={styles.scannerFrame}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                    </View>

                    {/* Bottom Bar */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry}>
                            <Ionicons name="keypad-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.manualButtonText}>Enter Manually</Text>
                        </TouchableOpacity>

                        {scanned && (
                            <TouchableOpacity
                                style={styles.scanAgainButton}
                                onPress={() => setScanned(false)}
                            >
                                <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </CameraView>
        </View>
    );
};

const scannerSize = width * 0.7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 20,
        marginBottom: 12,
    },
    permissionText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    permissionButton: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    topBar: {
        paddingTop: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    scannerFrame: {
        width: scannerSize,
        height: scannerSize,
        alignSelf: 'center',
        marginTop: (height - scannerSize) / 3,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        overflow: 'hidden',
    },
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#6C63FF',
        borderRadius: 2,
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#6C63FF',
        borderRadius: 2,
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#6C63FF',
        borderRadius: 2,
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#6C63FF',
        borderRadius: 2,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    manualButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(108, 99, 255, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 16,
    },
    manualButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    scanAgainButton: {
        padding: 12,
    },
    scanAgainText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default QRScanScreen;