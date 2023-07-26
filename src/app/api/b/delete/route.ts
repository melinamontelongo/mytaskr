import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
    try {
        const session = await getAuthSession();
        const url = new URL(req.url);
        const boardId = url.searchParams.get("id");

        if (!boardId) return new Response("Invalid query", { status: 400 });
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        //  Find workspace in db
        const boardToDelete = await db.board.findUnique({
            where: {
                id: boardId,
            },
            select: {
                workspace: {
                    select: {
                        creatorId: true,
                    }
                }
            }
        });
        if (boardToDelete?.workspace.creatorId !== session.user.id) return new Response("Only the workspace creator can delete boards", { status: 403 });

        await db.board.delete({
            where: {
                id: boardId,
            },
        })
        return new Response("Board deleted successfully!");
    } catch (e) {
        console.log(e)
        return new Response("Could not delete board, please try again later.", { status: 500 })
    }
}