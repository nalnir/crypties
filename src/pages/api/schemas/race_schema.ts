import mongoose, { Model, Schema } from 'mongoose';

const raceSchema = new mongoose.Schema({
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

export interface RaceDocument extends Document {
    _id: string;
    creatorAddress: string;
    name: string;
    description: string;
    image: string;
    playedBy: number;
    nameCombinations: string[];
    playedByAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
    default: boolean;
}

interface RaceModel extends Model<RaceDocument> { }

const Race = mongoose.models.Race as RaceModel || mongoose.model<RaceDocument, RaceModel>('Race', raceSchema);

export default Race;