import mongoose, { Connection, ConnectOptions } from 'mongoose'

// let connection: typeof mongoose | null = null

// async function connectDB() {

//     if (connection && connection.connection.readyState === 1) {
//         return connection
//     }

//     try {
//         connection = await mongoose.connect(`${process.env.MONGODB_URI}` ?? '', {
//             serverSelectionTimeoutMS: 5000,
//         })
//         console.log('MongoDB connected!')
//     } catch (err) {
//         console.error(err)
//         process.exit(1)
//     }
// }

// export default connectDB

export const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined. Please set the environment variable.');
    }
    
    if(mongoose.connection.readyState === 1) {
        return Promise.resolve(mongoose.connection);
    }

    return await mongoose.connect(MONGODB_URI);
}