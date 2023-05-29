import mongoose, { Model } from 'mongoose';

const userSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true, required: true },
    profilePicture: { type: String, required: false },
    alignment: { type: String, required: false },
    createFantasyRaceTries: { type: Number, required: false },
    createFantasyRaceNextCycle: { type: Date, required: false },
    onboarded: { type: Boolean, required: false },
});

export interface UserDocument extends Document {
    walletAddress: string;
    profilePicture?: string;
    alignment: "ligth" | "darkness";
    createFantasyRaceTries?: number;
    createFantasyRaceNextCycle?: Date;
    onboarded: boolean;
}

interface UserModel extends Model<UserDocument> {}

const User = mongoose.models.User as UserModel || mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;