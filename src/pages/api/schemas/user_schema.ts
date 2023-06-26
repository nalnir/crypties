import mongoose, { Model, Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    walletAddress: { type: String, unique: true, required: true },
    profilePicture: { type: String, required: false },
    alignment: { type: String, required: false },
    createTriesUsed: { type: Number, required: false },
    createNextCycle: { type: Date, required: false },
    onboarded: { type: Boolean, required: false },
    hasCreatePower: { type: Boolean, required: true },
    playerName: { type: String, required: false },
    generatedName: { type: String, required: false }
});

export interface UserDocument extends Document {
    _id: string;
    walletAddress: string;
    profilePicture?: string;
    alignment: "ligth" | "darkness";
    createTriesUsed?: number;
    createNextCycle?: Date;
    onboarded: boolean;
    hasCreatePower: boolean;
    playerName: string;
    generatedName: string;
}

interface UserModel extends Model<UserDocument> {}

const User = mongoose.models.User as UserModel || mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;