export class OTPGenerator {
    static generateOTP(length: number = 6): string {
        const digits = '0123456789';
        let otp = '';

        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        return otp;
    }

    static getExpiryTime(minutes: number = 10): Date {
        const now = new Date();
        return new Date(now.getTime() + minutes * 60 * 1000);
    }

    static isOTPExpired(expiresAt: Date): boolean {
        return new Date() > expiresAt;
    }
}