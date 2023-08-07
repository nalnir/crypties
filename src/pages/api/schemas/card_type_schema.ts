import mongoose, { Model, Schema } from 'mongoose';

const cardTypeSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    name: { type: String, required: true },
    power: { type: Number, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export interface CardTypeDocument extends Document {
    _id: string;
    name: string;
    power: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CardTypeModel extends Model<CardTypeDocument> { }

const CardType = mongoose.models.CardType as CardTypeModel || mongoose.model<CardTypeModel, CardTypeModel>('CardType', cardTypeSchema);

export default CardType;