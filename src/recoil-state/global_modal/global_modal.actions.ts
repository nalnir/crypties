import { useSetRecoilState } from "recoil";
import { InitialGlobalModalState, globalModalAtom } from "./global_modal.atom";

export function useGlobalModalActions() {
    const setGlobalModal = useSetRecoilState(globalModalAtom);

    return {
        openGlobalModal,
        closeGlobalModal
    };

    function openGlobalModal(component: JSX.Element) {
        setGlobalModal((state: any) => ({
            ...state,
            open: true,
            component: component
        }))
    }

    function closeGlobalModal() {
        setGlobalModal((state: any) => (InitialGlobalModalState))
    }
}