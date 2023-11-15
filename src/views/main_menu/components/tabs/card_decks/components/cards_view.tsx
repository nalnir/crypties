import { api } from "@/utils/api";

interface CardsViewModalProps {
    deck: any
}
export const CardsViewModal = ({ deck }: CardsViewModalProps) => {
    const getAllDefaultCards = api.defautlCard.getAllDefaultCards.useQuery();
    const allDefaultCards = getAllDefaultCards.data ?? []

    const matchedCards = allDefaultCards.filter(defaultCard =>
        deck.cards.some((defaultDeckCard: any) => defaultCard._id === defaultDeckCard.cardId)
    );

    return <div className="grid grid-cols-4 gap-3 overflow-y-auto h-120">
        {matchedCards.map((card: any, index: number) => {
            const cardAmount = deck.cards.find((defaultDeckCard: any) => defaultDeckCard.cardId === card._id).amountOfCards
            return <div key={index} className="p-3 border border-black rounded-lg bg-primary-500">
                <div className="flex items-center justify-between">
                    <p>{card.name}</p>
                    <p>{card.metadata.cardType}</p>
                </div>
                <img src={card.image_url} />
                <div className="flex items-center justify-between">
                    <p>Attack:</p>
                    <p>{card.metadata.attackPower}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p>Health:</p>
                    <p>{card.metadata.health}</p>
                </div>
                {card.metadata.special ?
                    <div className="flex items-center justify-between">
                        <p>Special:</p>
                        <p>{card.metadata.special}</p>
                    </div> : <></>
                }
                <div className="flex items-center justify-between">
                    <p>Amount:</p>
                    <p>{cardAmount}</p>
                </div>
            </div>
        })}
    </div>
}