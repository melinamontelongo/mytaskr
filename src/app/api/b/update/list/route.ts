import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListOrderUpdate, ListUpdate } from "@/lib/validators";
import { z } from "zod";

//  Update a list's order
export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });
        const body = await req.json();
        const { listId, listsIds } = ListOrderUpdate.parse(body);

        const listIndex = listsIds.findIndex((id) => id === listId);

        const prevListId = listsIds[listIndex - 1];
        const nextListId = listsIds[listIndex + 1];

        let prevList, nextList, newIndexNumber;

        //  Find list to be re-ordered
        const list = await db.list.findFirst({
            where: {
                id: listId,
            },
            select: {
                indexNumber: true,
            }
        });

        //  Find prev list if exists
        if (prevListId) {
            prevList = await db.list.findFirst({
                where: {
                    id: prevListId
                },
                select: {
                    indexNumber: true,
                }
            })
        }
        //  Find next list if exists
        if (nextListId) {
            nextList = await db.list.findFirst({
                where: {
                    id: nextListId,
                },
                select: {
                    indexNumber: true,
                }
            })
        }

        if (prevList && nextList) {
            newIndexNumber = (prevList.indexNumber + nextList.indexNumber) / 2;
        } else if (prevList && !nextList) {
            newIndexNumber = prevList.indexNumber * 2
        } else if (!prevList && nextList) {
            newIndexNumber = nextList.indexNumber / 2
        } else {
            throw new Error("Something went wrong.")
        }
        if (newIndexNumber) {
            await db.list.update({
                where: {
                    id: listId,
                },
                data: {
                    indexNumber: Math.round(newIndexNumber),
                }
            })
        }
        return new Response("Tasks reordered successfully!")
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not reorder tasks, please try again later.", { status: 500 })
    }
}

//  Delete list
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const listId = url.searchParams.get("id");

        const session = await getAuthSession();

        if (!listId) return new Response("Invalid query", { status: 400 });
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        await db.list.delete({
            where: {
                id: listId,
            },
        })
        return new Response("List deleted successfully!");
    } catch (e) {
        console.log(e)
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not reorder tasks, please try again later.", { status: 500 })
    }
}

//  Update list 
export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { name, description, listId } = ListUpdate.parse(body);
        const session = await getAuthSession();

        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        await db.list.update({
            where: {
                id: listId,
            },
            data: {
                name, description
            }
        })

        return new Response("List updated successfully!");
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not create list, please try again later.", { status: 500 });
    }
}