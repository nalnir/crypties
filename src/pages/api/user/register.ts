
import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../schemas/user_schema';
import connectDB from '@/backend/connection';
import { UserRegisterApiResponse, UserRegisterRequestBody } from './types';

export default async function handler(
    req: NextApiRequest,
    res: UserRegisterApiResponse
) {
    console.log('user/register => ()')
    if (req.method === 'POST') {
        const body = req.body as UserRegisterRequestBody;
        const db = await connectDB()
        const user = await User.create({
            walletAddress: body.walletAddress,
            profilePicture: body.profilePicture,
            alignment: body.alignment
        })
        if (user) {
            return res.status(200).json({ message: 'User created', data: user })
        } else {
            return res.status(500).json({ message: 'Could not create the user', data: user })
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}