import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useQuery } from "@tanstack/react-query";

function MainMenu() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    return <div className="grid grid-cols-2 bg-primary-400">
        <div className="flex items-center justify-center">
            <img src={user?.profilePicture} />
        </div>
    </div>
}

export default MainMenu;