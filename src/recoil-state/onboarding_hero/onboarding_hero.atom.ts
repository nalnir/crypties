import { atom } from 'recoil';

export type Alignment = 'light' | 'darkness';

export interface IFantasyRace {
    name: string;
    id: string;
}

export interface IClass {
    name: string;
    id: string
}

interface OnboardingHeroAtom {
    fantasyRace: IFantasyRace;
    class: IClass;
    description: string[];
    alignment: Alignment;
    imageOptions: string[];
    playerName: string;
}

export const InitialOnboardingHeroState: OnboardingHeroAtom = {
    fantasyRace: {
        name: '',
        id: ''
    },
    class: {
        name: '',
        id: ''
    },
    description: [],
    alignment: 'light',
    imageOptions: [],
    playerName: ''
}
export const onboardingHeroAtom = atom<OnboardingHeroAtom>({
    key: 'onboardingHeroState', // unique ID (with respect to other atoms/selectors)
    default: InitialOnboardingHeroState,
});