import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListCreation } from "@/lib/validators";
import {z} from "zod";

export async function POST(req:Request){
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, boardId } = ListCreation.parse(body);
        await db.list.create({
            data: {
                name, description, boardID: boardId,
            }
        });
        return new Response("List created successfully!");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not create board, please try again later.", { status: 500 });
    }
};