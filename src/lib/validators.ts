import { z } from "zod";

/************ USER ************/

export const UserCredentials = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Must contain at least 6 characters" }).max(18, { message: "Must contain at most 18 characters" }),
})
export type UserCredentialsType = z.infer<typeof UserCredentials>

export const UserProfileUpdate = z.object({
    username: z.string().min(3, { message: "Must contain at least 3 characters" }).max(16, { message: "Must contain at most 16 characters" }),
    name: z.string().min(3, { message: "Must contain at least 3 characters" }).max(32, { message: "Must contain at most 32 characters" }),
})
export type UserProfileUpdateType = z.infer<typeof UserProfileUpdate>

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
    name: z.string().min(3, { message: "Must contain at least 3 characters" }).max(32, { message: "Must contain at most 32 characters" }),
    description: z.string().max(150, { message: "Must contain at most 150 characters" }),
    visibility: z.enum(["public", "private"]),
})
export type WorkspaceCreationFormType = z.infer<typeof WorkspaceCreationForm>

//  Workspace invite
export const WorkspaceInvite = z.object({
    invitedUsers: z.string().array(),
    workspaceId: z.string().min(1),
})
export type WorkspaceInviteType = z.infer<typeof WorkspaceInvite>

//  Workspace uninvite
export const WorkspaceUninvite = z.object({
    uninvitedUser: z.string(),
    workspaceId: z.string(),
})
export type WorkspaceUninviteType = z.infer<typeof WorkspaceUninvite>

//  Workspace update
export const WorkspaceUpdate = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    visibility: z.enum(["public", "private"]),
    workspaceId: z.string(),
})
export type WorkspaceUpdateType = z.infer<typeof WorkspaceUpdate>

/************ BOARD ************/

//  Board creation request
export const BoardCreation = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    workspaceId: z.string(),
    backgroundImageFull: z.string().url().optional(),
    backgroundImageSmall: z.string().url().optional(),
})
export type BoardCreationType = z.infer<typeof BoardCreation>

//  Board creation form
export const BoardCreationForm = z.object({
    name: z.string().min(3, { message: "Must contain at least 3 characters" }).max(32, { message: "Must contain at most 32 characters" }),
    description: z.string().max(150, { message: "Must contain at most 150 characters" }),
})
export type BoardCreationFormType = z.infer<typeof BoardCreationForm>

export const BoardUpdate = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150),
    boardId: z.string(),
    backgroundImageFull: z.string().url().optional(),
    backgroundImageSmall: z.string().url().optional(),
})
export type BoardUpdateType = z.infer<typeof BoardUpdate>

//  Unsplash photo
export type UnsplashPhotoType = {
    id: string,
    alt_description: string,
    createdAt: string,
    description: string,
    links: {
        download_location: string,
    },
    urls: {
        full: string,
        small: string,
    },
    user: {
        id: string,
        username: string,
    },
    blur_hash: string,
}

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
    name: z.string().min(3, { message: "Must contain at least 3 characters" }).max(32, { message: "Must contain at most 32 characters" }),
    description: z.string().max(150, { message: "Must contain at most 150 characters" }).optional(),
})
export type ListCreationFormType = z.infer<typeof ListCreationForm>

//  List update
export const ListUpdate = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150).optional(),
    listId: z.string(),
});
export type ListUpdateType = z.infer<typeof ListUpdate>

//  List order update
export const ListOrderUpdate = z.object({
    listId: z.string(),
    listsIds: z.string().array(),
})
export type ListOrderUpdateType = z.infer<typeof ListOrderUpdate>

/************ TASK ************/
//  Create task
export const TaskCreation = z.object({
    name: z.string().min(3).max(32),
    description: z.string().max(150).optional(),
    listId: z.string(),
})
export type TaskCreationType = z.infer<typeof TaskCreation>

export const TaskCreationForm = z.object({
    name: z.string().min(3, { message: "Must contain at least 3 characters" }).max(32, { message: "Must contain at most 32 characters" }),
    description: z.string().max(150, { message: "Must contain at most 150 characters" }).optional(),
})
export type TaskCreationFormType = z.infer<typeof TaskCreationForm>

//  Task order update 
export const TaskOrderUpdate = z.object({
    listId: z.string(),
    taskId: z.string(),
    taskIds: z.string().array(),
})
export type TaskOrderUpdateType = z.infer<typeof TaskOrderUpdate>

//  Task update
export const TaskUpdate = z.object({
    name: z.string().min(3, { message: "Must contain at least 3 characters" }).max(32, { message: "Must contain at most 32 characters" }),
    description: z.string().max(150, { message: "Must contain at most 150 characters" }).optional(),
    taskId: z.string(),
})
export type TaskUpdateType = z.infer<typeof TaskUpdate>