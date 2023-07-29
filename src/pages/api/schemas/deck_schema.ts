import mongoose, { Model, Schema } from 'mongoose';


const deckSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, transform: (value: mongoose.Types.ObjectId) => value.toString(), },
    walletAddress: { type: String, required: true },
    cards: { type: [String], required: false },
    deckName: { type: String, required: true },
    image: { type: String, required: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });


export interface DeckDocument extends Document {
    _id: string;
    walletAddress: string;
    cards: string[];
    deckName: string;
    image: string;
}

interface DeckModel extends Model<DeckDocument> { }

const Deck = mongoose.models.Deck as DeckModel || mongoose.model<DeckModel, DeckModel>('Deck', deckSchema);

export default Deck;