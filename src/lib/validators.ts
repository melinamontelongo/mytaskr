import {z} from "zod";

//  User
export const UserCredentials = z.object({
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6).max(18),
})

export type UserCredentialsType = z.infer<typeof UserCredentials>

//  Workspace creation request
export const WorkspaceCreation = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    visibility: z.enum(["public", "private"]),
    createdBy: z.string(),
    invitedUsers: z.string().array(),
})

export type WorkspaceCreationType = z.infer<typeof WorkspaceCreation>

//  Workspace creation form
export const WorkspaceCreationForm = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    visibility: z.enum(["public", "private"]),
})

export type WorkspaceCreationFormType = z.infer<typeof WorkspaceCreationForm>