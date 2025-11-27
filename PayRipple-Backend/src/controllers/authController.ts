import { Request, Response } from 'express';
import User from '../models/User';
import OTP from '../models/OTP';
import { OTPGenerator } from '../utils/otpGenerator';
import { JWTService } from '../utils/jwt';
import * as bcrypt from 'bcryptjs';

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber || phoneNumber.length !== 10) {
            res.status(400).json({
                success: false,
                message: 'Valid 10-digit phone number required'
            });
            return;
        }

        const otp = OTPGenerator.generateOTP(6);
        const expiresAt = OTPGenerator.getExpiryTime(10);

        await OTP.findOneAndUpdate(
            { phoneNumber },
            {
                phoneNumber,
                otp,
                expiresAt,
                attempts: 0,
                isUsed: false,
            },
            { upsert: true, new: true }
        );

        console.log(`OTP for ${phoneNumber}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            retryDelay: 60,
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp || otp.length !== 6) {
            res.status(400).json({
                success: false,
                message: 'Phone number and 6-digit OTP required'
            });
            return;
        }

        const otpRecord = await OTP.findOne({
            phoneNumber,
            isUsed: false
        });

        if (!otpRecord) {
            res.status(400).json({
                success: false,
                message: 'OTP not found or already used'
            });
            return;
        }

        // Check if OTP is expired
        if (OTPGenerator.isOTPExpired(otpRecord.expiresAt)) {
            res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
            return;
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            res.status(400).json({
                success: false,
                message: 'Too many attempts. Please request a new OTP'
            });
            return;
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
            return;
        }

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        // Check if user exists
        const user = await User.findOne({ phoneNumber });

        if (user) {
            // User exists - generate token
            const token = JWTService.generateAccessToken({
                userId: user._id.toString(),
                phoneNumber: user.phoneNumber,
            });

            res.json({
                success: true,
                message: 'OTP verified successfully',
                token,
                user: {
                    id: user._id,
                    phoneNumber: user.phoneNumber,
                    name: user.name,
                    isVerified: user.isVerified,
                },
            });
        } else {
            // New user - no token yet, will be created after PIN setup
            res.json({
                success: true,
                message: 'OTP verified. Please set up your PIN',
                isNewUser: true,
            });
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const setPIN = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber, pin } = req.body;

        if (!phoneNumber || !pin || pin.length !== 4) {
            res.status(400).json({
                success: false,
                message: 'Phone number and 4-digit PIN required'
            });
            return;
        }

        // Hash the PIN manually
        const salt = await bcrypt.genSalt(12);
        const hashedPin = await bcrypt.hash(pin, salt);

        // Check if user already exists
        let user = await User.findOne({ phoneNumber });

        if (user) {
            // Update existing user's PIN
            user.pin = hashedPin;
            await user.save();
        } else {
            // Create new user with hashed PIN
            user = await User.create({
                phoneNumber,
                pin: hashedPin,
                isVerified: true,
            });
        }

        // Generate tokens
        const token = JWTService.generateAccessToken({
            userId: user._id.toString(),
            phoneNumber: user.phoneNumber,
        });

        const refreshToken = JWTService.generateRefreshToken({
            userId: user._id.toString(),
            phoneNumber: user.phoneNumber,
        });

        res.json({
            success: true,
            message: 'PIN set successfully',
            token,
            refreshToken,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error('Set PIN error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyPIN = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber, pin } = req.body;

        if (!phoneNumber || !pin) {
            res.status(400).json({
                success: false,
                message: 'Phone number and PIN required'
            });
            return;
        }

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        const isPinValid = await user.comparePin(pin);
        if (!isPinValid) {
            res.status(400).json({
                success: false,
                message: 'Invalid PIN'
            });
            return;
        }

        // Generate new token
        const token = JWTService.generateAccessToken({
            userId: user._id.toString(),
            phoneNumber: user.phoneNumber,
        });

        res.json({
            success: true,
            message: 'PIN verified successfully',
            token,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error('Verify PIN error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};