import mongoose, { Model, Schema } from 'mongoose';

const generationSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    generation: { type: Number, required: true },
    amountOfCardsForged: { type: Number, required: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });


export interface GenerationDocument extends Document {
    _id: string;
    generation: number;
    amountOfCardsForged: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface GenerationModel extends Model<GenerationDocument> { }

const Generation = mongoose.models.Generation as GenerationModel || mongoose.model<GenerationModel, GenerationModel>('Generation', generationSchema);

export default Generation;