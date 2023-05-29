import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useErrorSuccessActions } from "./error_success.actions";
import { ErrorSuccessType, errorSuccessAtom } from "./error_success.atom";
import { PText } from "@/shared/components/p_text";

export function ErrorSuccess() {
	const errorSuccessState = useRecoilValue(errorSuccessAtom);
	const errorSuccessActions = useErrorSuccessActions();
	const [ isOpened, setIsOpened ] = useState<boolean>(false)


	useEffect(() => {
		if (errorSuccessState.open) {
			setIsOpened(true)
			setTimeout(() => {
				setIsOpened(false)
				errorSuccessActions.closeErrorSuccess()
			}, errorSuccessState.timeout)
		} else {
			setIsOpened(false)
		}
	}, [ errorSuccessState.open ])

	const renderClass = () => {
		if(errorSuccessState.type === ErrorSuccessType.INFO) {
			return 'border-blue'
		} else if(errorSuccessState.type === ErrorSuccessType.WARNING) {
			return 'border-orange'
		} else if(errorSuccessState.type === ErrorSuccessType.ERROR) {
			return 'border-red'
		}
		return 'border-green'
	}

	if(isOpened) {
		return (
			<div className="absolute top-0 right-0">
				<div className={`${renderClass} p-3 m-3 rounded-lg shadow-lg border bg-white w-[400px]`}>
					<PText className="text-black">{errorSuccessState.message}</PText>
				</div>
			</div>
		);
	} 
	return <></>
}

export default ErrorSuccess;