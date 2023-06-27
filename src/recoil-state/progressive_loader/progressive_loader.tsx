import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { IProgressiveLoaderStep, progressiveLoaderAtom } from "./progressive_loader.atom";
import { useProgressiveLoaderActions } from "./progressive_loader.actions";
import { Modal } from "@mui/material";
import { LinearProgressWithLabel } from "./components/linear_with_label";
import { PText } from "@/shared/components/p_text";

export function ProgressiveLoader() {
    const progressiveLoaderState = useRecoilValue(progressiveLoaderAtom);
	const progressiveLoaderActions = useProgressiveLoaderActions();
	const [ isOpened, setIsOpened ] = useState<boolean>(false)
    const [ steps, setSteps ] = useState(0);
    const [ activeStep, setActiveStep ] = useState<IProgressiveLoaderStep>({
        position: 0,
        description: ''
    })

    useEffect(() => {
		if (progressiveLoaderState.open) {
			setIsOpened(true)
		} else {
			setIsOpened(false)
		}
	}, [ progressiveLoaderState.open ])

    useEffect(() => {
        setActiveStep(progressiveLoaderState.activeStep)
    }, [ progressiveLoaderState.activeStep ])

    useEffect(() => {
        setSteps(progressiveLoaderState.steps)
    }, [ progressiveLoaderState.steps ])


    return <Modal
        open={isOpened}
        onClose={() => {}}
        aria-labelledby="basic-modal-title"
        aria-describedby="basic-modal-description"
    >
        <div className="absolute top-1/3 left-1/3 w-[500px] bg-white rounded-lg shadow-lg p-3 ">
            <div className="space-y-3">
                <PText className="text-black">{activeStep.description} <span className="text-primary-400">{activeStep.position} / {steps}</span></PText>
                <LinearProgressWithLabel value={(activeStep.position / steps) * 100} />
            </div>
        </div>
    </Modal>
}