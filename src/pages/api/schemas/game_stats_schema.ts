import { OriginalCard } from '@/utils';
import mongoose, { Model, Schema } from 'mongoose';

const playersSchema = new mongoose.Schema({
    winner: { type: String },
    looser: { type: String }
});

const decksSchema = new mongoose.Schema({
    winner: { type: String },
    looser: { type: String }
});

const gameStatsSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    players: { type: playersSchema, required: true },
    decks: { type: decksSchema, required: true },
    game: {
        type: String,
        enum: ['FINISHED', 'DISCONNECTED', 'FORFEITED'],
        required: true,
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });


export interface GameStatsDocument extends Document {
    _id: string;
    players: {
        winner: string,
        looser: string
    };
    decks: {
        winner: string,
        looser: string
    };
    game: string,
    createdAt?: Date;
    updatedAt?: Date;
}

interface GameStatsModel extends Model<GameStatsDocument> { }

const GameStats = mongoose.models.GameStats as GameStatsModel || mongoose.model<GameStatsModel, GameStatsModel>('GameStats', gameStatsSchema);

export default GameStats;

