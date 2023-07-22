import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BoardCreation } from "@/lib/validators";
import {z} from "zod";

//  Create board
export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, workspaceId } = BoardCreation.parse(body);

        await db.board.create({
            data: {
                name, description, workspaceID: workspaceId,
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