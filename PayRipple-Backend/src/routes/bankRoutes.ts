import { Router } from 'express';
import {
    addBankAccount,
    getBankAccounts,
    setDefaultBankAccount,
    removeBankAccount
} from '../controllers/bankController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/add', authenticateToken, addBankAccount);
router.get('/list', authenticateToken, getBankAccounts);
router.put('/set-default', authenticateToken, setDefaultBankAccount);
router.delete('/remove/:accountId', authenticateToken, removeBankAccount);

export default router;