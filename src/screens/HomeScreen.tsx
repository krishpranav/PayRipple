import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    StatusBar,
    Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../store/store';
import { fetchWalletBalance } from '../store/authSlice';
import BalanceCard from '../components/BalanceCard';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreenNavigationProp } from '../navigation/types';

const HomeScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const { user, wallet, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        loadWalletBalance();
    }, []);

    const loadWalletBalance = () => {
        dispatch(fetchWalletBalance());
    };

    const handleAddMoney = () => {
        navigation.navigate('AddMoney');
    };

    const handleViewTransactions = () => {
        navigation.navigate('TransactionHistory');
    };

    const handleViewBankAccounts = () => {
        navigation.navigate('BankAccounts');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#6C63FF" barStyle="light-content" />

            {/* Purple Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.welcomeText}>
                            Hello, {user?.name || user?.phoneNumber}!
                        </Text>
                        <Text style={styles.subWelcomeText}>
                            Welcome to PayRipple
                        </Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                    </View>
                </View>
            </View>

            {/* ScrollView with proper spacing */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadWalletBalance} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Card with proper spacing from header */}
                <View style={styles.balanceCardContainer}>
                    <BalanceCard
                        balance={wallet?.balance || 0}
                        onAddMoney={handleAddMoney}
                        onViewTransactions={handleViewTransactions}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.actionsGrid}>
                        <View style={styles.actionItem}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="person-outline" size={24} color="#6C63FF" />
                            </View>
                            <Text style={styles.actionLabel}>Profile</Text>
                        </View>

                        <View style={styles.actionItem} onTouchEnd={handleViewBankAccounts}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="business-outline" size={24} color="#6C63FF" />
                            </View>
                            <Text style={styles.actionLabel}>Banks</Text>
                        </View>

                        <View style={styles.actionItem}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="qr-code-outline" size={24} color="#6C63FF" />
                            </View>
                            <Text style={styles.actionLabel}>Scan QR</Text>
                        </View>

                        <View style={styles.actionItem}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="card-outline" size={24} color="#6C63FF" />
                            </View>
                            <Text style={styles.actionLabel}>Cards</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Transactions Preview */}
                <View style={styles.recentTransactions}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <Text
                            style={styles.seeAllText}
                            onPress={handleViewTransactions}
                        >
                            See All
                        </Text>
                    </View>

                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={48} color="#CCCCCC" />
                        <Text style={styles.emptyStateText}>No transactions yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Your transaction history will appear here
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
    header: {
        backgroundColor: '#6C63FF',
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 30,
        paddingHorizontal: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    subWelcomeText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.85)',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 30,
        paddingTop: 0,
    },
    balanceCardContainer: {
        // marginTop: -15,
        marginTop: 10,
        marginHorizontal: 20,
        marginBottom: 30,
    },
    quickActions: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        gap: 10,
    },
    actionItem: {
        alignItems: 'center',
        flex: 1,
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
    },
    actionLabel: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '600',
        textAlign: 'center',
    },
    recentTransactions: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    seeAllText: {
        fontSize: 15,
        color: '#6C63FF',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 17,
        color: '#666666',
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 30,
    },
});

export default HomeScreen;