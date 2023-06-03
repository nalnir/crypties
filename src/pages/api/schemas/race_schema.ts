import mongoose, { Model } from 'mongoose';

const raceSchema = new mongoose.Schema({
    creatorAddress: { type: String, unique: false, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    playedBy: { type: Number, required: false },
    nameCombinations: { type: [String], required: false }
});

export interface RaceDocument extends Document {
    creatorAddress: string,
    name: string;
    description: string;
    image: string;
    playedBy: number;
    nameCombinations: string[];
}

interface RaceModel extends Model<RaceDocument> {}

const Race = mongoose.models.Race as RaceModel || mongoose.model<RaceDocument, RaceModel>('Race', raceSchema);

export default Race;