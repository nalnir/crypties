import { useSetRecoilState } from "recoil";
import { IProgressiveLoaderStep, InitialProgressiveLoaderState, progressiveLoaderAtom } from "./progressive_loader.atom";

export function useProgressiveLoaderActions() {
    const setProgressiveLoader = useSetRecoilState(progressiveLoaderAtom);

    return {
        openProgressiveLoader,
        closeProgressiveLoader,
        setActiveStep
    };

    function openProgressiveLoader(steps: number, initialStep: IProgressiveLoaderStep) {
        setProgressiveLoader((state: any) => ({
            ...state,
            open: true,
            steps: steps,
            activeStep: initialStep
        }))
    }

    function setActiveStep(step: IProgressiveLoaderStep) {
        setProgressiveLoader((state: any) => ({
            ...state,
            activeStep: step,
        }))
    }

    function closeProgressiveLoader() {
        setTimeout(() => {
            setProgressiveLoader((state: any) => (InitialProgressiveLoaderState))
        }, 1000)
    }
}