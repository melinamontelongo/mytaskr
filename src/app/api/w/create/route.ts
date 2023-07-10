import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { WorkspaceCreation } from "@/lib/validators";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, visibility, createdBy, invitedUsers } = WorkspaceCreation.parse(body);
        const isPublic = visibility === "public";

        await db.workspace.create({
            data: {
                name, description, isPublic, creatorId: createdBy, usersIDs: invitedUsers,
            },
        })

        return new Response("Workspace created successfully!")
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not create workspace, please try again later.", { status: 500 })
    }
}