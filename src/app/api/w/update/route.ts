import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { WorkspaceUpdate } from "@/lib/validators";
import { z } from "zod";

export async function PUT(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, visibility, workspaceId } = WorkspaceUpdate.parse(body);
        const isPublic = visibility === "public";

        const workspace = await db.workspace.findUnique({
            where: {
                id: workspaceId,
            },
            select: {
                creatorId: true,
                usersIDs: true,
            }
        });

        if (!workspace) return new Response("Workspace not found", { status: 404 });
        if (!(session.user.id === workspace.creatorId) && !workspace.usersIDs.includes(session.user.id)) return new Response("Only workspace members can update them", { status: 403 });

        await db.workspace.update({
            where: {
                id: workspaceId,
            },
            data: {
                name, description, isPublic
            },
        })
        await db.activity.create({
            data: {
                type: "UpdatedWorkspace",
                name,
                description: "Updated workspace",
                workspaceId,
                userID: session.user.id,
            }
        });

        return new Response("Workspace updated successfully!");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not delete workspace, please try again later.", { status: 500 })
    }
}