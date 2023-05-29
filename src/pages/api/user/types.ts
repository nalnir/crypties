import { NextApiRequest, NextApiResponse } from "next";
import { UserDocument } from "../schemas/user_schema";

export interface UserApiRequest extends NextApiRequest {
    query: {
      walletAddress: UserDocument['walletAddress'];
    };
}

export interface UserApiResponse extends NextApiResponse {
    data: UserDocument | null;
}

export interface UserRegisterRequestBody {
    walletAddress: string;
    profilePicture: Blob;
    alignment: "light" | "darkness";
}

export interface UserRegisterApiResponse extends NextApiResponse {
    data: UserDocument | null;
}