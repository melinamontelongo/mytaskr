import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BoardUpdate } from "@/lib/validators";
import { z } from "zod";

export async function PUT(req:Request){
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json()
        const { name, description, boardId, backgroundImageFull, backgroundImageSmall } = BoardUpdate.parse(body);

        await db.board.update({
            where: {
                id: boardId,
            },
            data: {
                name, description, backgroundImageFull, backgroundImageSmall
            }
        });
        await db.activity.create({
            data: {
                type: "UpdatedBoard",
                name,
                description: "Updated board",
                userID: session.user.id,
                boardId,
            }
        });

        return new Response("Board updated successfully!");
        
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not create list, please try again later.", { status: 500 });
    }
}