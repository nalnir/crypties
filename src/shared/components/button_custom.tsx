import { CircularProgress } from "@mui/material"
import { PText } from "./p_text"

interface ButtonCustomProps {
    onClick: () => void
    title: string,
    className?: string,
    textClassName?: string,
    isLoading?: boolean,
}
export const ButtonCustom = ({
    onClick,
    title,
    className,
    textClassName,
    isLoading
}: ButtonCustomProps) => {
    return <div onClick={onClick} className={`${className ?? 'bg-secondary-400'} cursor-pointer space-x-3 border rounded-lg p-3 flex justify-center items-center`}>
        {isLoading ? <CircularProgress className="w-5 h-5" /> : <></>}<PText className={`${textClassName ?? 'text-white'}`}>{title}</PText>
    </div>
}