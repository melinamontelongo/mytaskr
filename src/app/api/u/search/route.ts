import { db } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url);
    const userQuery = url.searchParams.get("u");

    if(!userQuery) return new Response("Invalid query", {status: 400});

    const foundUsers = await db.user.findMany({
        where: {
            email: {
                startsWith: userQuery,
            }
        },
        select:{
            id: true,
            email: true,
        }
    });
    return new Response(JSON.stringify(foundUsers));
}