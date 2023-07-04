import { normalizeWalletAddress } from "./normalize_wallet_address";

export function generateFantasyName(walletAddress: string) {
    const normalizedAddress = normalizeWalletAddress(walletAddress);
    const { prefixes, middleNames, suffixes } = fantasyNameComponents;
  
    const seedValue = parseInt(normalizedAddress, 16); // Convert normalized address to a decimal seed value
  
    const randomPrefixIndex = getRandomIndex(prefixes.length, seedValue);
    const randomMiddleNameIndex = getRandomIndex(middleNames.length, seedValue + 1);
    const randomSuffixIndex = getRandomIndex(suffixes.length, seedValue + 2);
  
    const randomPrefix = prefixes[randomPrefixIndex];
    const randomMiddleName = middleNames[randomMiddleNameIndex];
    const randomSuffix = suffixes[randomSuffixIndex];
  
    const fantasyName = `${randomPrefix} ${randomMiddleName} ${randomSuffix}`;
  
    return fantasyName;
}

function getRandomIndex(arrayLength: number, seedValue: number) {
    return Math.floor(seedValue % arrayLength);
}

const fantasyNameComponents = {
    prefixes: [
        'Dark',
        'Golden',
        'Mystic',
        'Radiant',
        'Shadow',
        'Silver',
        'Whispering',
        'Crimson',
        'Enchanted',
        'Ancient',
        'Noble',
        'Starlight',
        'Lunar',
        'Ember',
        'Ethereal',
        'Storm',
        'Dusk',
        'Celestial',
        'Forgotten',
        'Shining',
        'Cursed',
        'Frozen',
        'Fiery',
        'Tranquil',
        'Everlasting',
        'Silent',
        'Dream',
        'Wandering',
        'Wise',
        'Blazing',
        'Sapphire',
        'Dawn',
        'Glimmering',
        'Whimsical',
        'Cerulean',
        'Spectral',
        'Phantom',
        'Twilight',
        'Illustrious',
        'Ornate',
        'Ebon',
        'Vibrant',
        'Astral',
        'Majestic',
        'Sable',
        'Opulent',
        'Epic',
        'Vivid',
        'Mythic',
        'Obsidian',
        'Sovereign',
        'Luminous',
        'Divine',
        'Resplendent',
        'Harmonic',
        'Amber',
        'Gilded',
        'Jade',
        'Onyx',
        'Pristine',
        'Raven',
        'Sacred',
        'Valiant',
        'Whisper',
        'Enigmatic',
        'Arctic',
        'Cosmic',
        'Flaming',
        'Hallowed',
        'Nebula',
        'Solemn',
        'Mythical',
        'Serenity',
        'Violet',
        'Zephyr',
        'Labyrinthine',
        'Harmonious',
        'Obscure',
        'Verdant',
        'Amethyst',
        'Azure',
        'Benevolent',
        'Crescent',
        'Crystalline',
        'Empyreal',
        'Frost',
        'Halcyon',
        'Iridescent',
        'Mirthful',
        'Nimbus',
        'Oracle',
        'Penumbral',
        'Quicksilver',
        'Sylvan',
        'Umbral',
        'Vesper',
        'Whisperwind',
        'Zephyrus'
    ],
    middleNames: [
        'Blade',
        'Dragon',
        'Moon',
        'Rose',
        'Star',
        'Storm',
        'Thorn',
        'Sword',
        'Wolf',
        'Blossom',
        'Spirit',
        'Raven',
        'Sky',
        'Falcon',
        'Whisper',
        'Shadow',
        'Gale',
        'Lily',
        'Phoenix',
        'Sage',
        'Oak',
        'Wren',
        'Viper',
        'Breeze',
        'Echo',
        'Flame',
        'Nova',
        'Seren',
        'Hawk',
        'Lotus',
        'Ember',
        'Aegis',
        'Valkyrie',
        'Sylvan',
        'Cascade',
        'Lore',
        'Blaze',
        'Jasmine',
        'Zephyr',
        'Orion',
        'Aurora',
        'Eclipse',
        'Basilisk',
        'Jade',
        'Mercury',
        'Ivory',
        'Petal',
        'Skylark',
        'Thistle',
        'Stormrider',
        'Sable',
        'Amber',
        'Everest',
        'Wisp',
        'Glimmer',
        'Frost',
        'Birch',
        'Whisperwood',
        'Moonshadow',
        'Starling',
        'Bladewind',
        'Wolfsbane',
        'Thornstrike',
        'Swordbreaker',
        'Dragonheart',
        'Rosepetal',
        'Falconcrest',
        'Skysong',
        'Ravenwing',
        'Galesong',
        'Shadowdancer',
        'Lilysong',
        'Phoenixfire',
        'Sageleaf',
        'Oakheart',
        'Wrenspell',
        'Viperfang',
        'Breezefall',
        'Echoflame',
        'Flameheart',
        'Novarunner',
        'Serenwhisper',
        'Hawkshadow',
        'Lotusmoon',
        'Emberglow',
        'Aegisshield',
        'Valkyriewind',
        'Sylvanhaven',
        'Cascadewhisper',
        'Loreweaver',
        'Blazeblade',
        'Jasminesong',
        'Zephyrwing',
        'Orionstrike',
        'Aurorasky',
        'Eclipsesoul',
        'Basiliskbane',
        'Jadewillow',
        'Mercuryfrost',
        'Ivorythorn',
        'Petalstorm',
        'Skylarkwing',
        'Thistlemist',
        'Sablemoon',
        'Amberglade',
        'Everestwind',
        'Wisperglow',
        'Glimmerstone',
        'Frostbrook',
        'Birchsong',
        'Larkspur',
        'Cinderflame',
        'Violetspell',
        'Galestorm',
        'Silverwing',
        'Peregrinestrike',
        'Wilderheart',
        'Flintstone',
        'Marigoldshine',
        'Ariarain',
        'Rowanwood',
        'Solsticeshadow',
        'Garnetflame',
        'Midnightthorn',
        'Duskfire',
        'Topazwhisper',
        'Skylarsong',
        'Runeshadow',
        'Whisperarrow',
        'Sparrowfall',
        'Willowshade',
        'Valorsong',
        'Lunawind',
        'Wandermist',
        'Bramblesong',
        'Lilacwhisper',
        'Questbringer',
        'Phoenixstrike',
        'Cypressbreeze',
        'Drakeheart',
        'Rainstorm',
        'Wildersong',
        'Shadowfire',
        'Stormsong',
        'Moonwhisper',
        'Starweaver',
        'Bladeflame',
        'Wolfsong',
        'Swordbearer',
        'Rosebloom',
        'Falconeye',
        'Skystorm',
        'Ravenshadow',
        'Galewind',
        'Lilystone',
        'Phoenixwing',
        'Sagewalker',
        'Oakenheart',
        'Viperstrike',
        'Breezewhisper',
        'Echofire',
        'Flamefury',
        'Novasurge',
        'Serenelight',
        'Hawkblade',
        'Lotuspetal',
        'Emberflare',
        'Aegisbane',
        'Valkyriewhisper',
        'Sylvanleaf',
        'Cascadebrook',
        'Lorekeeper',
        'Blazeflare',
        'Jasminebloom',
        'Zephyrsong',
        'Orionstar',
        'Auroradusk',
        'Eclipseshade',
        'Basiliskfang',
        'Mercuryscale',
        'Petalwhisper',
        'Stormbringer',
        'Amberleaf',
        'Everestpeak',
        'Whisperglow',
        'Frostbite',
        'Birchshadow',
        'Galespirit',
        'Silverthorn',
        'Peregrineflight',
        'Wildersoul',
        'Flintblade',
        'Marigoldpetal',
        'Garnetfire',
        'Duskfall',
        'Skylight',
        'Runehunter',
        'Wanderer',
        'Cypresswind',
        'Drakescale',
        'Rainshadow',
        'Wildewalker',
        'Moonshade',
        'Stagheart',
        'Ashenfire',
        'Elmleaf',
        'Saffron',
        'Crimson',
        'Indigo',
        'Amethyst',
        'Obsidian',
        'Veridian',
        'Vermilion',
        'Slate',
        'Azure',
        'Moss',
        'Copper',
        'Steel',
        'Ebony',
        'Scarlet',
        'Goldleaf',
        'Silverthistle',
        'Wintersong',
        'Summerbreeze',
        'Whisperingwind',
        'Shadowstrike',
        'Moonfire',
        'Dragonbane',
        'Starshine',
        'Bladewalker',
        'Wolfheart',
        'Thornbloom',
        'Roseblade',
        'Skywatcher',
        'Lilythorn',
        'Phoenixflight',
        'Sagesong',
        'Oakenshield',
        'Flamestrike',
        'Serenewhisper',
        'Hawkeye',
        'Lotusdream',
        'Emberglide',
        'Sylvansong',
        'Cascadeheart',
        'Blazewind',
        'Jasmineblossom',
        'Zephyrblade',
        'Orionsong',
        'Aurorashadow',
        'Eclipsesong',
        'Basiliskstrike',
        'Jadewhisper',
        'Mercurystone',
        'Thistlemoon',
        'Stormbreaker',
        'Amberglow',
        'Whisperglade',
        'Frostfire',
        'Cinderflare',
        'Violetheart',
        'Peregrinewind',
        'Flintstrike',
        'Marigoldsun',
        'Duskblade',
        'Valiantstrike',
        'Bramblethorn',
        'Phoenixflare',
        'Cypressmoon',
        'Ashenflame',
        'Rustfire',
        'Oakenspell',
        'Thunderstrike',
        'Stardancer',
        'Ironclaw',
        'Goldenleaf',
        'Twilightwhisper',
        'Rivers',
        'Mystara',
        'Eldritch',
        'Vortex',
        'Eternia',
        'Nyxus',
        'Oblivion',
        'Thule',
        'Azazel',
        'Nebulus',
        'Ethereon',
        'Celestis',
        'Avalanche',
        'Spectra',
        'Aeonis',
        'Ignis',
        'Aurum',
        'Nyxel',
        'Zenith',
        'Arcanum',
        'Chronos',
        'Sylvaris',
        'Nimbus',
        'Vespera',
        'Halcyon',
        'Elysium',
        'Nocturna',
        'Solara',
        'Luminary',
        'Phantasm',
        'Crescent',
        'Elysian',
        'Mythos',
        'Zephyrion',
        'Inferno',
        'Celestia',
        'Elysara',
        'Euphoria',
        'Hallowed',
        'Lorelei',
        'Lyricus',
        'Aurelia',
        'Serenade',
        'Pandora',
        'Nyxia',
        'Valkyria',
        'Elysiana',
        'Harmonia',
        'Serenity',
        'Astral',
        'Novae',
        'Aetheria',
        'Nebula',
        'Solstice',
        'Aria',
        'Aether',
        'Eternus',
        'Luminos',
        'Mystique',
        'Rhapsody',
        'Harmony',
        'Sylph',
        'Aeon',
        'Nyx',
        'Caelum',
        'Enigma',
        'Aetherial',
        'Cinder',
        'Avalon',
        'Elysia',
        'Eos',
        'Oberon',
        'Elara',
        'Nereus',
        'Arcane',
        'Maelstrom',
        'Cassiopeia',
        'Etherea',
        'Vega',
        'Azura',
        'Celestine',
        'Lyra',
        'Lysander',
        'Seraphina',
        'Gideon',
        'Caspian',
        'Arabella',
        'Finnian',
        'Isolde',
        'Lucian',
        'Evangeline',
        'Emrys',
        'Leander',
        'Cedric',
        'Theron',
        'Selene',
        'Damien',
        'Maeve',
        'Alaric',
        'Sylvia',
        'Cyrus',
        'Eowyn',
        'Cassius',
        'Rhiannon',
        'Dorian',
        'Isadora',
        'Gareth',
        'Calista',
        'Tristan',
        'Alistair',
        'Rowena',
        'Gwendolyn',
        'Eamon',
        'Melisande',
        'Eliana',
        'Peregrine',
        'Vivienne',
        'Ryder',
        'Seraphine',
        'Lachlan',
        'Alden',
        'Genevieve',
        'Lysandra',
        'Hawthorne',
        'Aveline',
        'Caelan',
        'Elowen',
        'Gemma',
        'Thaddeus',
        'Lilith',
        'Marius',
        'Nadia',
        'Darius',
        'Sylvana',
        'Tiberius',
        'Serena',
        'Cassian',
        'Delphine',
        'Valerian',
        'Amara',
        'Lucinda',
        'Solomon',
        'Nathaniel',
        'Fiona',
        'Soren',
        'Anastasia',
        'Emilia',
        'Thalia',
        'Gregory',
        'Rosalind',
        'Leopold',
        'Mira',
        'Phoebe',
        'Cressida',
        'Evander',
        'Luna',
        'Hermione',
        'Magnus',
        'Sabrina',
        'Ariadne',
        'Evelina',
        'Ophelia',
        'Benedict',
        'Felicity',
        'Julian',
    ],
    suffixes: [
        'bane',
        'heart',
        'shadow',
        'blade',
        'fire',
        'stone',
        'thorn',
        'whisper',
        'crest',
        'flame',
        'storm',
        'fury',
        'strike',
        'light',
        'song',
        'soul',
        'star',
        'dream',
        'thunder',
        'gale',
        'valor',
        'arrow',
        'sky',
        'dawn',
        'moon',
        'mist',
        'nova',
        'hope',
        'glory',
        'hunter',
        'shade',
        'root',
        'shard',
        'spark',
        'glow',
        'wind',
        'stream',
        'frost',
        'spirit',
        'wave',
        'ember',
        'leaf',
        'pulse',
        'thistle',
        'fate',
        'chase',
        'watcher',
        'tide',
        'dusk',
        'blaze',
        'sorrow',
        'dreamer',
        'steel',
        'whisperer',
        'champion',
        'enigma',
        'void',
        'blossom',
        'legend',
        'wanderer',
        'seeker',
        'sentinel',
        'sage',
        'oracle',
        'beacon',
        'phantom',
        'sapphire',
        'rune',
        'mystic',
        'scribe',
        'wraith',
        'prophet',
        'quill',
        'muse',
        'rider',
        'talon',
        'specter',
        'falcon',
        'dagger',
        'cipher',
        'celestial',
        'wisp',
        'labyrinth',
        'dreamweaver',
        'apex',
        'seraph',
        'keeper',
        'sylvan',
        'thunderbolt',
        'arrowhead',
        'wyvern',
        'moonlight',
        'nightshade',
        'silver',
        'vanguard',
        'horizon',
        'zephyr',
        'astral',
        'firebrand',
        'frostwind',
        'solaris',
        'tidecaller',
        'starlight',
        'serenade',
        'alabaster',
        'radiance',
        'shadowfall',
        'thunderstrike',
        'stormrider',
        'harbinger',
        'bladewind',
        'whirlwind',
        'emberheart',
        'moonshadow',
        'skylark',
        'glimmer',
        'oathbreaker',
        'stormchaser',
        'sunset',
        'dreadnought',
        'frostbite',
        'lunaris',
        'whisperwind',
        'stardust',
        'sunstrike',
        'twilight',
        'nightfall',
        'stormweaver',
        'firestorm',
        'frostfire',
        'shadowflare',
        'thunderheart',
        'bladeflame',
        'whispersteel',
        'starfire',
        'moonwhisper',
        'skyward',
        'solstice',
        'voidwalker',
        'emberflame',
        'sunflare',
        'stormbreaker',
        'dawnblade',
        'frostthorn',
        'shadowdancer',
        'thunderfall',
    ],
}