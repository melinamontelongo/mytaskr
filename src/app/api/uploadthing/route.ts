import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { utapi } from "uploadthing/server";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
    router: ourFileRouter,
});

export async function DELETE(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                image: true,
            }
        });
        if (!user?.image) return new Response("User has no picture to remove", { status: 409 });

        //  Get key based on image url
        const imageUrlArr = user.image.split("/")
        const imageKey = imageUrlArr[imageUrlArr.length - 1];

        //  Delete pic from uploadthing
        await utapi.deleteFiles(imageKey);

        //  Update db
        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                image: null
            },
        });

        return new Response("Picture deleted successfully");
    } catch (e) {
        return new Response("Something went wrong", { status: 500 });
    }
}