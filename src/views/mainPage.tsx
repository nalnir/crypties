import Register from "@/views/register/register";
import { HeaderMain } from "@/shared/components";
import { AuthGuard } from "@/recoil-state/auth/auth.guard";
import { useQuery } from '@tanstack/react-query';
import { UserDocument } from '@/pages/api/schemas/user_schema';
import { Link } from '@imtbl/imx-sdk';

export type Room = {
    roomId: string;
    players: number;
};

const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';
const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

function MainPage() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    if (isLoading) {
        // Data is still loading, show loading indicator or something else
        return <div>Loading...</div>;
    }

    return <AuthGuard>
        <div className="flex">
            <div>
                <HeaderMain />
                <div>
                    <Register />
                </div>
            </div>
        </div>
    </AuthGuard>
}

export default MainPage

