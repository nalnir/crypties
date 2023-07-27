import mongoose, { Model, Schema } from 'mongoose';

const cardsSchema = new mongoose.Schema({
    ref: { type: Schema.Types.ObjectId, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
});

const deckSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    walletAddress: { type: String, required: true },
    cards: { type: cardsSchema, required: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });


export interface DeckDocument extends Document {
    _id: string;
    walletAddress: string;
    cards?: {

    };
}

interface DeckModel extends Model<DeckDocument> { }

const Deck = mongoose.models.Deck as DeckModel || mongoose.model<DeckModel, DeckModel>('Deck', deckSchema);

export default Deck;