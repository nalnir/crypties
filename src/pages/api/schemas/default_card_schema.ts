import mongoose, { Model, Schema } from 'mongoose';

const defaultCardSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    metadata: {
        health: { type: Number, required: true },
        attackPower: { type: Number, required: true },
        special: { type: String, required: false },
        creatorPlayerName: { type: String, required: true },
        creatorAddress: { type: String, required: true },
        creatorLoreName: { type: String, required: true },
        cardType: { type: String, required: true },
        cardTypeId: { type: String, required: true },
        collection: { type: String, required: false },
        generation: { type: Number, required: true },
        imageId: { type: String, required: true },
        default: { type: Boolean, required: true }
    },
    isPublished: { type: Boolean, required: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export interface DefaultCardDocument extends Document {
    _id: string,
    name: string,
    description: string,
    image_url: string,
    metadata: {
        health: number,
        attackPower: number,
        special?: string,
        creatorPlayerName: string,
        creatorAddress: string,
        creatorLoreName: string,
        cardType: string,
        cardTypeId: string,
        collection?: string,
        generation: number,
        imageId: string,
        default: boolean
    },
    createdAt?: Date;
    updatedAt?: Date;
    isPublished?: boolean
}

interface DefaultCardModel extends Model<DefaultCardDocument> { }

const DefaultCard = mongoose.models.DefaultCard as DefaultCardModel || mongoose.model<DefaultCardModel, DefaultCardModel>('DefaultCard', defaultCardSchema);

export default DefaultCard;