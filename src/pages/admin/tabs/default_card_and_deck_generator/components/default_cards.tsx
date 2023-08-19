
import { ButtonCustom, PText } from "@/shared";
import { trpc } from "@/utils/trpc"
import { Carousel } from "flowbite-react";
import DefaultCard from "./default_card";

export default function DefaultCards() {
    const getAllDefaultCards = trpc.getAllDefaultCards.useQuery();

    return <div className="grid items-start justify-center grid-cols-4 gap-3 max-h-96">
        {getAllDefaultCards ? getAllDefaultCards.data?.map((defaultCard, index) => <DefaultCard key={index} defaultCard={defaultCard} />) : <></>}
    </div >
}