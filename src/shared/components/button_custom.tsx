import { CircularProgress } from "@mui/material"
import { PText } from "./p_text"

interface ButtonCustomProps {
    onClick: () => void
    title: string,
    className?: string,
    textClassName?: string,
    isLoading?: boolean,
    disabled?: boolean
}
export const ButtonCustom = ({
    onClick,
    title,
    className,
    textClassName,
    isLoading,
    disabled
}: ButtonCustomProps) => {
    return <div onClick={() => {
        if (disabled) {
            return
        } else {
            onClick()
        }
    }} className={`${className ?? 'bg-secondary-400'} ${disabled ? 'opacity-50' : 'opacity-100'} cursor-pointer space-x-3 border rounded-lg p-3 flex justify-center items-center`}>
        {isLoading ? <CircularProgress className="w-5 h-5" /> : <></>}<PText className={`${textClassName ?? 'text-white'}`}>{title}</PText>
    </div>
}