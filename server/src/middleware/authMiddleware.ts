import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthReq } from '../types/types'

const jwtSecret = String(process.env.JWT_SECRET);   // Set JWT_SECRET in server/.env

export const authenticateToken = (req: AuthReq, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, jwtSecret, (err, user: any) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};