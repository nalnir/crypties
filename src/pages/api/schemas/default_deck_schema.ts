import { CardInDefaultDeck } from '@/utils';
import mongoose, { Model, Schema } from 'mongoose';

const defaultRandomCardsSetSchema = new mongoose.Schema({
    cardType: { type: String, required: true },
    cardTypeId: { type: Schema.Types.ObjectId, transform: (value: mongoose.Types.ObjectId) => value.toString() },
    amountOfCards: { type: Number, required: true }
});

const defaultCardsSetSchema = new mongoose.Schema({
    cardId: { type: Schema.Types.ObjectId, transform: (value: mongoose.Types.ObjectId) => value.toString() },
    amountOfCards: { type: Number, required: true }
});

const defaultDeckSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString() },
    deckName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, required: false },
    cards: { type: [defaultCardsSetSchema], required: false },
    generation: { type: Number, required: true },
    randomCards: { type: [defaultRandomCardsSetSchema], required: false },
    walletAddress: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export interface DefaultDeckDocument extends Document {
    _id: string,
    deckName: string,
    description: string,
    image: string,
    createdAt?: Date;
    updatedAt?: Date;
    isPublished?: boolean
    cards: CardInDefaultDeck[];
    generation: number;
    randomCards: CardInDefaultDeck[];
    walletAddress: string;
    price: number;
}

interface DefaultDeckModel extends Model<DefaultDeckDocument> { }

const DefaultDeck = mongoose.models.DefaultDeck as DefaultDeckModel || mongoose.model<DefaultDeckModel, DefaultDeckModel>('DefaultDeck', defaultDeckSchema);

export default DefaultDeck;