import { UserRoles } from "@/pages/api/enums";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { WithChildren } from "@/shared";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

export interface SuperAdminGuardProps extends WithChildren {
    test?: string;
}

export const SuperAdminGuard = ({ children }: SuperAdminGuardProps) => {
    const errorSuccessActions = useErrorSuccessActions();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const router = useRouter();

    useEffect(() => {
        if (!user?.roles?.includes(UserRoles.SUPERADMIN)) {
            router.replace('/')
        }
    })

    if (user?.roles?.includes(UserRoles.SUPERADMIN)) {
        return <div>{children}</div>;
    }

    return <div>Loading...</div>;
};