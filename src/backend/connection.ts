import mongoose, { Connection, ConnectOptions } from 'mongoose'

let connection: typeof mongoose | null = null

async function connectDB() {

    if (connection && connection.connection.readyState === 1) {
        return connection
    }

    try {
        connection = await mongoose.connect(`${process.env.MONGODB_URI}` ?? '', {
            serverSelectionTimeoutMS: 5000,
        })
        console.log('MongoDB connected!')
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default connectDB