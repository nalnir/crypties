import mongoose, { Model } from 'mongoose';

const playerClassSchema = new mongoose.Schema({
    creatorAddress: { type: String, unique: false, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    playedBy: { type: Number, required: false },
    nameCombinations: { type: [String], required: false }
});

export interface PlayerClassDocument extends Document {
    creatorAddress: string,
    name: string;
    description: string;
    image: string;
    playedBy: number;
    nameCombinations: string[];
}

interface PlayerClassModel extends Model<PlayerClassDocument> {}

const PlayerClass = mongoose.models.PlayerClass as PlayerClassModel || mongoose.model<PlayerClassModel, PlayerClassModel>('PlayerClass', playerClassSchema);

export default PlayerClass;