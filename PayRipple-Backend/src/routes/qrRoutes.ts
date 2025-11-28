import { Router } from 'express';
import {
    generateQRCode,
    processQRPayment
} from '../controllers/qrController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/generate', authenticateToken, generateQRCode);
router.post('/pay', authenticateToken, processQRPayment);

export default router;