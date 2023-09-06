import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { user } from "../objects/user";

export const connectToLobby = publicProcedure
    .input(user)
    .mutation(async (opts) => {
        const inputs = opts.input;

    })