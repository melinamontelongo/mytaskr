import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

//  Get user's activity
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const limit = url.searchParams.get("limit");
        const page = url.searchParams.get("page");
        const session = await getAuthSession();

        if (!limit || !page) return new Response("Invalid query", { status: 400 });
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const activityCount = await db.activity.count({
            where: {
                userID: session.user.id
            }
        });
        
        const activity = await db.activity.findMany({
            where: {
                userID: session.user.id,
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                type: true,
                boardId: true,
                workspaceId: true,
                name: true,
                description: true,
                createdAt: true,
                userID: true,
                board: {
                    include: {
                        workspace: true,
                    }
                }
            }
        });
        return new Response(JSON.stringify({count: activityCount, activity}))
    } catch (e) {
        return new Response("Could not fetch activity", { status: 500 })
    }
}