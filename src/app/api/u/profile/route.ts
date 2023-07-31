import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserProfileUpdate } from "@/lib/validators";
import { z } from "zod";

export async function PUT(req:Request){
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, username } = UserProfileUpdate.parse(body);

        //  Check if username exists already
        if(session.user.username !== username){
            const usernameExists = await db.user.findFirst({
                where: {
                    username,
                }
            })
            if(usernameExists) return new Response("Username already exists.", {status: 409});
        };
        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                name, username
            }
        })

        return new Response("User information updated successfully!");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not update user information, please try again later.", { status: 500 });
    }
}