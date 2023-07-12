import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

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
                //c) who are not the creators of this workspace
                createdWorkspaces: {
                    none: {
                        id: workspaceId,
                    }
                },
                //d) who are not already members of this workspace 
                workspaces: {
                    none: {
                        users: {
                            some: {
                                email: { //fix this bc it will get all users that start with query
                                    startsWith: userQuery,
                                }
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                email: true,
/*                 createdWorkspaces: true,
                workspaces: true, */
            }
        });
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
/*                 createdWorkspaces: true,
                workspaces: true, */
            }
        });
    }

    return new Response(JSON.stringify(foundUsers));
}