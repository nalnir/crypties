import { procedure } from "@/server/trpc";
import { z } from "zod";
import { user } from "../objects/user";

export const connectToLobby = procedure
    .input(user)
    .mutation(async (opts) => {
        const inputs = opts.input;

    })