import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { WorkspaceCreation } from "@/lib/validators";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, visibility, invitedUsers } = WorkspaceCreation.parse(body);
        const isPublic = visibility === "public";

        const workspace = await db.workspace.create({
            data: {
                name, description, isPublic, creatorId: session.user.id, usersIDs: invitedUsers,
                users: {
                    connect: invitedUsers.map(i => ({ id: i })) || [],
                },
            },
        });
        await db.activity.create({
            data: {
                workspaceId: workspace.id,
                type: "CreatedWorkspace",
                name: workspace.name,
                description: "Created workspace",
                userID: session.user.id,
            }
        });
        invitedUsers.map(async (u) => {
            await db.activity.create({
                data: {
                    workspaceId: workspace.id,
                    type: "JoinedWorkspace",
                    name: workspace.name,
                    description: `Joined workspace`,
                    userID: u,
                }
            })
        });
        return new Response("Workspace created successfully!")
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not create workspace, please try again later.", { status: 500 })
    }
}