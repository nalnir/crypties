import { atom } from 'recoil';

export type Alignment = 'light' | 'darkness';

interface OnboardingHeroAtom {
    fantasyRace: string;
    class: string;
    description: string[];
    alignment: Alignment;
    imageOptions: string[];
    playerName: string;
}

export const InitialOnboardingHeroState: OnboardingHeroAtom = {
    fantasyRace: 'Human',
    class: '',
    description: [],
    alignment: 'light',
    imageOptions: [],
    playerName: ''
}
export const onboardingHeroAtom = atom<OnboardingHeroAtom>({
    key: 'onboardingHeroState', // unique ID (with respect to other atoms/selectors)
    default: InitialOnboardingHeroState,
});