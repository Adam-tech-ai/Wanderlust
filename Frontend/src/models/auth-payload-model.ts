import { UserModel } from "./user-model";

// Represents the JWT payload:
export type AuthPayloadModel = {

    // Logged-in user:
    user: UserModel;
};