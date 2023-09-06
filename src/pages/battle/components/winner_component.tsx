import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { ButtonCustom } from "@/shared"
import { Hero } from "@/utils/types/hero"
import { useRouter } from "next/router";

export default function WinnerComponent() {
    const globalModalActions = useGlobalModalActions();
    const router = useRouter();

    const acceptWin = () => {
        globalModalActions.closeGlobalModal();
        router.replace('/');
    }

    return <div className="rounded-lg flex flex-col space-y-3 justify-center items-center">
        <p className="text-black">YOU WON</p>
        <ButtonCustom title="Accept" onClick={acceptWin} />
    </div>
}