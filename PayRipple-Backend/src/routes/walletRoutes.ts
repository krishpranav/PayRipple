import { Router } from 'express';
import {
    getWalletBalance,
    addMoneyToWallet,
    getWalletTransactions
} from '../controllers/walletController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/balance', authenticateToken, getWalletBalance);
router.post('/add-money', authenticateToken, addMoneyToWallet);
router.get('/transactions', authenticateToken, getWalletTransactions);

export default router;