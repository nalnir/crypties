
import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../schemas/user_schema';
import connectDB from '@/backend/connection';
import { UserApiRequest, UserApiResponse } from './types';

export default async function handler(
  req: UserApiRequest,
  res: UserApiResponse
) {
  console.log('user/login => ()')
  const db = await connectDB()
  const user = await User.findOne({ walletAddress: req.query.walletAddress })
  return res.status(200).json({ message: 'User found', data: user })
}