// Represents a user in the system:
export type UserModel = {
    userId?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role?: string;
};