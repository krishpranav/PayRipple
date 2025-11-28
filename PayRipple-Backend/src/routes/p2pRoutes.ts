import { Router } from 'express';
import {
    sendMoney,
    requestMoney,
    getP2PHistory
} from '../controllers/p2pController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/send', authenticateToken, sendMoney);
router.post('/request', authenticateToken, requestMoney);
router.get('/history', authenticateToken, getP2PHistory);

export default router;