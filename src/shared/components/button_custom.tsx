import { PText } from "./p_text"

interface ButtonCustomProps {
    onClick: () => void
    title: string,
    className?: string,
    textClassName?: string
}
export const ButtonCustom = ({
    onClick,
    title,
    className,
    textClassName
}: ButtonCustomProps) => {
    return <div onClick={onClick} className={`${className ?? 'bg-secondary-400'} cursor-pointer border rounded-lg p-3 flex justify-center items-center`}>
        <PText className={`${textClassName ?? 'text-white'}`}>{title}</PText>
    </div>
}