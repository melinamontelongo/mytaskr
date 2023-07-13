import { z } from "zod";

//  User
export const UserCredentials = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6).max(18),
})
export type UserCredentialsType = z.infer<typeof UserCredentials>

/************ WORKSPACE ************/

//  Workspace creation request
export const WorkspaceCreation = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    visibility: z.enum(["public", "private"]),
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

//  Workspace invite
export const WorkspaceInvite = z.object({
    invitedUsers: z.string().array(),
    workspaceId: z.string(),
})
export type WorkspaceInviteType = z.infer<typeof WorkspaceInvite>

/************ BOARD ************/

//  Board creation request
export const BoardCreation = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    workspaceId: z.string(),
})
export type BoardCreationType = z.infer<typeof BoardCreation>

//  Board creation form
export const BoardCreationForm = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
})
export type BoardCreationFormType = z.infer<typeof BoardCreationForm>

/************ LIST ************/

//  List creation
export const ListCreation = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150).optional(),
    boardId: z.string(),
});
export type ListCreationType = z.infer<typeof ListCreation>

//  List creation form
export const ListCreationForm = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150).optional(),
})
export type ListCreationFormType = z.infer<typeof ListCreationForm>