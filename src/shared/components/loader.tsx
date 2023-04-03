import { useProgress } from "@react-three/drei";

export const Loader = () => {
    const { progress } = useProgress();
    return <div className="flex items-center justify-center h-screen align-middle bg-primary-400">
        <div>
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="50" cy="50" r="45" stroke="#FFDB6F" strokeWidth="10" fill="none" />
                <circle cx="50" cy="50" r="35" stroke="#FED049" strokeWidth="10" fill="none">
                    <animate
                        attributeName="r"
                        values="35; 20; 35"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-width"
                        values="10; 2; 10"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="50" cy="50" r="25" stroke="#EAB543" strokeWidth="10" fill="none">
                    <animate
                        attributeName="r"
                        values="25; 15; 25"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-width"
                        values="10; 2; 10"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 50 50"
                        to="-360 50 50"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="50" cy="50" r="15" stroke="#E056FD" strokeWidth="10" fill="none">
                    <animate
                        attributeName="r"
                        values="15; 5; 15"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-width"
                        values="10; 2; 10"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
            {Math.floor(progress)}% loaded
        </div>
    </div>;
}