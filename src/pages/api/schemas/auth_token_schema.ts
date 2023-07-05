import mongoose, { Model, Schema } from 'mongoose';

const authTokenSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    // code: { type: String, unique: false, required: true },
    validUntil: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    userWalletAddress: { type: String, required: true },
});

export interface AuthTokenDocument extends Document {
    _id: string;
    // code: string,
    validUntil: string;
    userId: string;
    userWalletAddress: string;
}

interface AuthTokenModel extends Model<AuthTokenDocument> {}

const AuthToken = mongoose.models.AuthToken as AuthTokenModel || mongoose.model<AuthTokenModel, AuthTokenModel>('AuthToken', authTokenSchema);

export default AuthToken;