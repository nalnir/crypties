import { Hero } from "@/utils/types/hero"

interface HeroComponentProps {
    hero: Hero
}
export default function HeroComponent({ hero }: HeroComponentProps) {
    return <div className="rounded-full w-32 h-32 border border-1 border-secondary-400">
        <img src={hero.image} className="rounded-full" />
        <p>{hero.health}</p>
    </div>
}