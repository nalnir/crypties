import mongoose, { Model, Schema } from 'mongoose';

const playerClassSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    creatorAddress: { type: String, unique: false, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    playedBy: { type: Number, required: false },
    nameCombinations: { type: [String], required: false },
    playedByAmount: { type: Number, required: false },
    default: { type: Boolean, required: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export interface PlayerClassDocument extends Document {
    _id: string;
    creatorAddress: string,
    name: string;
    description: string;
    image: string;
    playedBy: number;
    nameCombinations: string[];
    playedByAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
    default: boolean
}

interface PlayerClassModel extends Model<PlayerClassDocument> { }

const PlayerClass = mongoose.models.PlayerClass as PlayerClassModel || mongoose.model<PlayerClassModel, PlayerClassModel>('PlayerClass', playerClassSchema);

export default PlayerClass;