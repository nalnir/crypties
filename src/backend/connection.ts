import mongoose, { Connection, ConnectOptions } from 'mongoose'

export const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.log('MONGODB_URI is not defined. Please set the environment variable.')
        return;
        // throw new Error('MONGODB_URI is not defined. Please set the environment variable.');
    }

    if (mongoose.connection.readyState === 1) {
        return Promise.resolve(mongoose.connection);
    }

    return await mongoose.connect(MONGODB_URI);
}