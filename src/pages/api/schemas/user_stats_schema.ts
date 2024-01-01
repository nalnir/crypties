import mongoose, { Model, Schema } from 'mongoose';

const userStatsSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    opponents: {
        type: Map,
        of: new mongoose.Schema({
            winsAgainst: { type: Number, required: true },
            lossesAgainst: { type: Number, required: true },
            totalGames: { type: Number, required: true }
        }, { _id: false })
    },
    totalWins: { type: Number, required: true },
    totalLosses: { type: Number, required: true },
    longestWinStreak: { type: Number, required: true },
    longestLossStreak: { type: Number, required: true },
    currentWinStreak: { type: Number, required: true },
    currentLossStreak: { type: Number, required: true },
    walletAddress: { type: String, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });


export interface UserStatsDocument extends Document {
    _id: string;
    opponents: {
        [walletAddress: string]: {
            winsAgainst: number,
            lossesAgainst: number,
            totalGames: number
        }
    },
    totalWins: number,
    totalLosses: number,
    longestWinStreak: number
    longestLossStreak: number
    currentWinStreak: number
    currentLossStreak: number
    createdAt?: Date;
    updatedAt?: Date;
    walletAddress: string;
}

interface UserStatsModel extends Model<UserStatsDocument> { }

const UserStats = mongoose.models.UserStats as UserStatsModel || mongoose.model<UserStatsModel, UserStatsModel>('UserStats', userStatsSchema);

export default UserStats;