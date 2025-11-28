import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchTransactions } from '../store/walletSlice';
import TransactionItem from '../components/TransactionItem';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionHistoryScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { transactions, isLoading, pagination } = useSelector((state: RootState) => state.wallet);

    const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = (page: number = 1) => {
        dispatch(fetchTransactions({ page, limit: 20 }));
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    const handleLoadMore = () => {
        if (pagination.hasNext && !isLoading) {
            loadTransactions(pagination.currentPage + 1);
        }
    };

    const getTotalAmount = (type: 'credit' | 'debit') => {
        return filteredTransactions
            .filter(t => t.type === type && t.status === 'success')
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bottomSpacer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Transaction History</Text>
                    <Text style={styles.subtitle}>
                        {pagination.totalTransactions} transactions found
                    </Text>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryCards}>
                    <View style={[styles.summaryCard, styles.incomeCard]}>
                        <Ionicons name="arrow-down" size={20} color="#4CAF50" />
                        <Text style={styles.summaryAmount}>₹{getTotalAmount('credit').toLocaleString('en-IN')}</Text>
                        <Text style={styles.summaryLabel}>Money In</Text>
                    </View>

                    <View style={[styles.summaryCard, styles.expenseCard]}>
                        <Ionicons name="arrow-up" size={20} color="#F44336" />
                        <Text style={styles.summaryAmount}>₹{getTotalAmount('debit').toLocaleString('en-IN')}</Text>
                        <Text style={styles.summaryLabel}>Money Out</Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'credit' && styles.filterTabActive]}
                        onPress={() => setFilter('credit')}
                    >
                        <Text style={[styles.filterText, filter === 'credit' && styles.filterTextActive]}>
                            Received
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'debit' && styles.filterTabActive]}
                        onPress={() => setFilter('debit')}
                    >
                        <Text style={[styles.filterText, filter === 'debit' && styles.filterTextActive]}>
                            Sent
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Transactions List */}
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionItem transaction={item} />}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={() => loadTransactions(1)} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={64} color="#CCCCCC" />
                            <Text style={styles.emptyStateTitle}>No Transactions</Text>
                            <Text style={styles.emptyStateText}>
                                {filter === 'all'
                                    ? 'Your transaction history will appear here'
                                    : `No ${filter} transactions found`
                                }
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
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
    header: {
        backgroundColor: '#FFFFFF',
        padding: 20,
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
        fontSize: 14,
        color: '#666',
    },
    summaryCards: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    summaryCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    incomeCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    expenseCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#F44336',
    },
    summaryAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
    },
    filterTabs: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 4,
    },
    filterTabActive: {
        backgroundColor: '#6C63FF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        flexGrow: 1,
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
});

export default TransactionHistoryScreen;