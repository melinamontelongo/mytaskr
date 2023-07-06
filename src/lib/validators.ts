import {z} from "zod";

export const UserCredentials = z.object({
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6).max(18),
})

export type UserCredentialsType = z.infer<typeof UserCredentials>

