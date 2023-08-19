import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { globalModalAtom } from "./global_modal.atom";
import { useGlobalModalActions } from "./global_modal.actions";
import { Box, Modal } from "@mui/material";

export function GlobalModal() {
	const globalModalState = useRecoilValue(globalModalAtom);
	const globalModalActions = useGlobalModalActions();
	const [isOpened, setIsOpened] = useState<boolean>(false)

	useEffect(() => {
		if (globalModalState.open) {
			setIsOpened(true)
		} else {
			setIsOpened(false)
		}
	}, [globalModalState.open])

	return (
		<Modal
			open={isOpened}
			onClose={() => globalModalActions.closeGlobalModal()}
			aria-labelledby="basic-modal-title"
			aria-describedby="basic-modal-description"
		>
			<div className="absolute p-3 m-10 bg-white rounded-lg shadow-lg h-fit ">
				{globalModalState.component ? globalModalState.component : <></>}
			</div>
		</Modal>
	);
}

export default GlobalModal;