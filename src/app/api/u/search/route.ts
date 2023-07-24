import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "next-auth";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const userQuery = url.searchParams.get("u");
    const workspaceId = url.searchParams.get("w");
    const session = await getAuthSession();

    if (!userQuery) return new Response("Invalid query", { status: 400 });
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    let foundUsers;

    //  Query is being done from an already created workspace
    if (workspaceId) {
        //  Find users: 
        foundUsers = await db.user.findMany({
            where: {
                //a) whose email starts with query
                email: {
                    startsWith: userQuery,
                },
                //b) who are not current user 
                NOT: {
                    id: session.user.id,
                },
            },
            select: {
                id: true,
                email: true,
            }
        });

        //  Get workspace's users IDs and creator's id
        const workspaceUsers = await db.workspace.findFirst({
            where: {
                id: workspaceId,
            },
            select: {
                usersIDs: true,
                createdBy: {
                    select: {
                        id: true,
                    }
                },
            },
        })
        //  Filter users who are already workspace members or have created the workspace
        foundUsers = foundUsers.filter((user) => !workspaceUsers?.usersIDs.includes(user.id) && !(workspaceUsers?.createdBy.id === user.id))
        
        //  Query is being done from workspace creation
    } else {
        //  Find user: 
        foundUsers = await db.user.findMany({
            where: {
                //a) whose email starts with query
                email: {
                    startsWith: userQuery,
                },
                //b) who are not current user 
                NOT: {
                    id: session.user.id,
                },
            },
            select: {
                id: true,
                email: true,
            }
        });
    }
    return new Response(JSON.stringify(foundUsers));
}