import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BoardCreation } from "@/lib/validators";
import { z } from "zod";

//  Create board
export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, workspaceId, backgroundImageFull, backgroundImageSmall } = BoardCreation.parse(body);

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
        if (!(session.user.id === workspace.creatorId) && !workspace.usersIDs.includes(session.user.id)) return new Response("Only workspace members can create boards", { status: 403 });

        await db.board.create({
            data: {
                name, description, workspaceID: workspaceId, backgroundImageFull, backgroundImageSmall,
                activity: {
                    create: {
                        userID: session.user.id,
                        type: "CreatedBoard",
                        name: name,
                        description: "Created board",
                    }
                }
            }
        });
        return new Response("Board created successfully!");
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not create board, please try again later.", { status: 500 })
    };
};