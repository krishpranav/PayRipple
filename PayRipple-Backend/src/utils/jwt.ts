import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    phoneNumber: string;
}

export class JWTService {
    static generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '15m',
        });
    }

    static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: '7d',
        });
    }

    static verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    }

    static verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    }
}