import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: Request){
    try {
        const session = await getAuthSession();
        const url = new URL(req.url);
        const workspaceId = url.searchParams.get("id");

        if (!workspaceId) return new Response("Invalid query", { status: 400 });
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        //  Find workspace in db
        const workspaceToDelete = await db.workspace.findUnique({
            where: {
                id: workspaceId,
            },
            select: {
                creatorId: true,
                name: true,
            }
        })
        if(workspaceToDelete?.creatorId !== session.user.id) return new Response("Only the workspace creator can delete it", {status: 403})
        
        await db.workspace.delete({
            where: {
                id: workspaceId,
            },
        })
        await db.activity.create({
            data: {
                name: workspaceToDelete.name,
                type: "DeletedWorkspace",
                description: "Deleted workspace",
                userID: session.user.id,
            }
        })
        return new Response("Workspace deleted successfully!");
    } catch (e) {
        return new Response("Could not reorder tasks, please try again later.", { status: 500 })
    }
}