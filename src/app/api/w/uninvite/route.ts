import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { WorkspaceUninvite } from "@/lib/validators";
import { z } from "zod";

export async function PUT(req:Request){
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { uninvitedUser, workspaceId } = WorkspaceUninvite.parse(body);
        
        //  Find workspace
        const workspace = await db.workspace.findFirst({
            where: {
                id: workspaceId,
            },
            select: {
                usersIDs: true,
                creatorId: true
            }
        });

        if(!workspace) return new Response("Workspace not found", {status: 404});
        if(workspace.creatorId !== session.user.id) return new Response("Only the workspace creator can uninvite users", {status: 403});

        const newUserIds = workspace?.usersIDs.filter((id) => id !== uninvitedUser);
        await db.workspace.update({
            where: {
                id: workspaceId,
            },
            data: {
                usersIDs: {
                    set: newUserIds,
                },
                users: {
                    connect: newUserIds.map(i => ({ id: i })) || [],
                }
            }
        });
        return new Response("User has been removed from this workspace.");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not remove user from the workspace, please try again later.", { status: 500 })
    }
}