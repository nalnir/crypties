import { useEnemyCardActions } from "@/recoil-state/enemy_cards/enemy_card/enemy_card.actions";
import { usePlayerCardActions } from "@/recoil-state/player_cards/player_card/player_card.actions";
import { playerCardAtom } from "@/recoil-state/player_cards/player_card/player_card.atom";
import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { animated } from "react-spring"
import { useRecoilValue } from "recoil";

interface EnemyCardProps {
    cardIndex: number,
    card: PlayingCardModel
    // img: string,
    // name: string,
    // desc: string,
    // attackPower: number,
    // health: number
}
export const EnemyCard = ({ cardIndex, card }: EnemyCardProps) => {
    const enemyCardActions = useEnemyCardActions();
    const playerCardActions = usePlayerCardActions();
    const cardState = useRecoilValue(playerCardAtom)

    const handleSelect = async (event: any) => {
        const cardElement = document.getElementById(`enemyCard${cardIndex}`);

        if (cardElement) {
            const cardElement = event.currentTarget;
            const cardRect = cardElement.getBoundingClientRect();

            const diffX = cardRect.left - cardState.cardCoordinates.left;
            const diffY = cardRect.top - cardState.cardCoordinates.top;
            enemyCardActions.setTargetCard({ left: diffX, top: diffY }, card, cardIndex)

            setTimeout(() => {
                enemyCardActions.setTargetCard({ left: 0, top: 0 }, null, null)
                playerCardActions.pickCard(null)
            }, 300)
        }
    }

    return <animated.div
        id={`enemyCard${cardIndex}`}
        onClick={handleSelect}
        className="relative p-3 space-y-3 bg-green-300 rounded-lg shadow-lg cursor-pointer grow max-h-80 h-80"
    >
        <div className="relative border-2 rounded-lg border-primary-500">
            <img className="rounded-lg" src={'/textures/card_image_placeholders/imp.png'} alt="Creature picture" />
            <div className="absolute top-0 right-0 space-y-5">
                <div className="flex items-center justify-center w-10 h-10 transform rotate-45 bg-purple-100">
                    <div className="-rotate-45">{card.attackPower}</div>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full shadow-lg">
                    <div>{card.health}</div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between">
            <div className="flex items-center justify-center">
                {card.name}
            </div>
            <div className="line-clamp-4">
                {card.desc}
            </div>
        </div>
    </animated.div>
}