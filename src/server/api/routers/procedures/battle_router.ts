
import { z } from "zod";
import { user } from "../objects/user";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const battleRouter = createTRPCRouter({
    connectToLobby: authenticatedProcedure
        .input(user)
        .mutation(async (opts) => {
            const inputs = opts.input;

        })
})
