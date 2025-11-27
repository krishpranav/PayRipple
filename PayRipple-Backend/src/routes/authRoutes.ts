import { Router } from 'express';
import {
    sendOTP,
    verifyOTP,
    setPIN,
    verifyPIN,
} from '../controllers/authController';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/set-pin', setPIN);
router.post('/verify-pin', verifyPIN);

export default router;