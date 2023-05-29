import { useRecoilValue, useSetRecoilState } from "recoil";
import { ErrorSuccessType, InitialErrorSuccessState, errorSuccessAtom } from "./error_success.atom";

export function useErrorSuccessActions() {
    const setErrorSuccess = useSetRecoilState(errorSuccessAtom);
    const errorSuccessState = useRecoilValue(errorSuccessAtom)

    return {
        openErrorSuccess,
        closeErrorSuccess
    };

    function openErrorSuccess(message: string, type?: ErrorSuccessType, timeout?: number) {
        setErrorSuccess((state: any) => ({
            ...state,
            open: true,
            message: message,
            type: type ?? ErrorSuccessType.INFO,
            timeout: timeout ?? 1500
        }))
    }

    function closeErrorSuccess() {
        setErrorSuccess((state: any) => (InitialErrorSuccessState))
    }
}