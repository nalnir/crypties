export interface ClassProps {
    _id: string,
    name: string,
    description: string,
    img: string
}
export const classList: ClassProps[]  = [
    {
        _id: "001",
        name: "Warrior",
        description: "The warrior, adorned in gleaming armor, wields their mighty weapon with unmatched skill. They embody valor, braving perilous quests, clashing blades with ferocity, and defending their allies with unwavering loyalty on the fantastical battlefield.",
        img: "/images/playerClasses/warrior_class.png"
    },
    {
        _id: "002",
        name: "Ranger",
        description: "The ranger, draped in nature's hues, is a master of both bow and blade. Their keen senses and bond with the wilderness make them expert trackers, stealthy scouts, and deadly marksman, navigating untamed realms with grace.",
        img: "/images/playerClasses/ranger_class.png"
    },
    {
        _id: "003",
        name: "Wizard",
        description: "The wizard, cloaked in arcane robes, harnesses the raw power of magic. Through ancient incantations and mystical knowledge, they command the elements, unravel secrets, and shape reality itself, wielding immense spells to both create and destroy.",
        img: "/images/playerClasses/wizard_class.png"
    },
    {
        _id: "004",
        name: "Paladin",
        description: "The paladin, clad in radiant armor, is a righteous champion of virtue and justice. They wield both sword and divine magic, smiting evil with unwavering devotion and shielding allies with unwavering loyalty. Embodying righteousness, they are a beacon of hope.",
        img: "/images/playerClasses/paladin_class.png"
    },
    {
        _id: "005",
        name: "Thief",
        description: "The thief, shrouded in shadows, is a nimble and cunning rogue. With deft hands and silent footsteps, they excel in stealth, lock-picking, and swift strikes. Masters of subterfuge and deception, they excel at acquiring coveted treasures and maneuvering in the shadows.",
        img: "/images/playerClasses/thief_class.png"
    },
    {
        _id: "006",
        name: "Priest",
        description: "The priest, draped in sacred vestments, is a devout servant of the divine. They channel the power of their deity to heal the wounded, banish darkness, and bless their allies. Guided by faith, they offer spiritual guidance and serve as a beacon of divine grace.",
        img: "/images/playerClasses/priest_class.png"
    },
    {
        _id: "007",
        name: "Necromancer",
        description: "The necromancer, shrouded in dark robes, commands the forces of death and decay. They tap into forbidden knowledge to raise the undead, wield necrotic spells, and manipulate life force. Masters of forbidden arts, they straddle the line between life and death.",
        img: "/images/playerClasses/necromancer_class.png"
    },
]