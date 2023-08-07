import { PText } from "@/shared";
import { trpc } from "@/utils/trpc"
import { Carousel } from "flowbite-react";

export const DefaultCards = () => {
    const getAllDefaultCards = trpc.getAllDefaultCards.useQuery();

    return <div className="grid items-start justify-center grid-cols-4 gap-3 max-h-96">
        {getAllDefaultCards ? getAllDefaultCards.data?.map((defaultCard, index) => {
            let color = `bg-card-${defaultCard.metadata.cardType}`;
            return <div className={`p-3 border rounded-lg ${color}`
            } key={index} >
                <img src={defaultCard.image_url} className="rounded-lg" alt={defaultCard.name} />
                <PText className="flex !whitespace-nowrap truncate text-ellipsis">{defaultCard.name}</PText>
                <PText>Attack: {defaultCard.metadata.attackPower}</PText>
                <PText>Health: {defaultCard.metadata.health}</PText>
            </div>
        }) : <></>}
    </div >
}