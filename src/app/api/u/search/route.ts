import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url);
    const userQuery = url.searchParams.get("u");
    const session = await getAuthSession();

    if(!userQuery) return new Response("Invalid query", {status: 400});
    if(!session?.user) return new Response("Unauthorized", {status: 401});
    
    const foundUsers = await db.user.findMany({
        where: {
            email: {
                startsWith: userQuery,
            },
            NOT: {
                id: session.user.id,
              },
        },
        select:{
            id: true,
            email: true,
        }
    });
    return new Response(JSON.stringify(foundUsers));
}