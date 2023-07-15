import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListCreation, ListUpdate } from "@/lib/validators";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, boardId } = ListCreation.parse(body);
        //  Check if it's first list to be created on this board
        const existentLists = await db.list.count({
            where: {
                boardID: boardId,
            },
        })

        //  Not the first one in this board
        if (existentLists > 0) {
            //  Get list with max index
            const maxIndexList = await db.list.aggregate({
                where: {
                    boardID: boardId,
                },
                _max: {
                    indexNumber: true,
                }
            })
            if (maxIndexList._max.indexNumber) {
                //  Create list increasing index
                await db.list.create({
                    data: {
                        name, description, boardID: boardId,
                        indexNumber: maxIndexList._max.indexNumber + 1024,
                    }
                })
            } else {
                throw new Error("Something went wrong");
            }
            //  It's the first one in this board
        } else {
            await db.list.create({
                data: {
                    name, description, boardID: boardId,
                    indexNumber: 1040,
                }
            })
        }
        return new Response("List created successfully!");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not create list, please try again later.", { status: 500 });
    }
};

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });
        const body = await req.json();
        const { listId, listsIds } = ListUpdate.parse(body);

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
        console.log(e)
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not reorder tasks, please try again later.", { status: 500 })
    }
}