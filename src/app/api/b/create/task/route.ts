import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { TaskCreation, TaskUpdate } from "@/lib/validators";
import { z } from "zod";
//  Create task
export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, listId } = TaskCreation.parse(body);
        //  Check if it's first task to be created on this list
        const existentTasks = await db.task.count({
            where: {
                listId,
            },
        })
        //  Not the first one in this list
        if (existentTasks > 0) {
            //  Get task with max index
            const maxIndexTask = await db.task.aggregate({
                where: {
                    listId,
                },
                _max: {
                    indexNumber: true,
                }
            })
            if (maxIndexTask._max.indexNumber) {
                //  Create task increasing index
                await db.task.create({
                    data: {
                        name, description, listId,
                        indexNumber: maxIndexTask._max.indexNumber + 1024,
                    }
                })
            } else {
                throw new Error("Something went wrong");
            }
            //  It's the first one in this list
        } else {
            await db.task.create({
                data: {
                    name, description, listId,
                    indexNumber: 1040,
                }
            })
        }
        return new Response("Task created successfully!");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not create task, please try again later.", { status: 500 });
    }
}
//  Modify position inside same list
export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });
        const body = await req.json();
        const { listId, taskId, taskIds } = TaskUpdate.parse(body);

        const taskIndex = taskIds.findIndex((id) => id === taskId);

        const prevTaskId = taskIds[taskIndex - 1]
        const nextTaskId = taskIds[taskIndex + 1]

        let prevTask, nextTask, newIndexNumber;
        //  Find task to be re-ordered
        const task = await db.task.findFirst({
            where: {
                id: taskId,
            },
            select: {
                indexNumber: true,
            }
        });
        //  Find prev task if exists
        if (prevTaskId) {
            prevTask = await db.task.findFirst({
                where: {
                    id: prevTaskId
                },
                select: {
                    indexNumber: true,
                }
            })
        }
        //  Find next task if exists
        if (nextTaskId) {
            nextTask = await db.task.findFirst({
                where: {
                    id: nextTaskId,
                },
                select: {
                    indexNumber: true,
                }
            })
        }
        if (prevTask && nextTask) {
            newIndexNumber = (prevTask.indexNumber + nextTask.indexNumber) / 2;
        } else if (prevTask && !nextTask) {
            newIndexNumber = prevTask.indexNumber * 2
        } else if (!prevTask && nextTask) {
            newIndexNumber = nextTask.indexNumber / 2
        } else {
            throw new Error("Something went wrong.")
        }
        if (newIndexNumber) {
            await db.task.update({
                where: {
                    id: taskId,
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
//  Modify position between lists
export async function PUT(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });
        const body = await req.json();
        const { listId, taskId, taskIds } = TaskUpdate.parse(body);

        const taskIndex = taskIds.findIndex((id) => id === taskId);

        const prevTaskId = taskIds[taskIndex - 1]
        const nextTaskId = taskIds[taskIndex + 1]

        let prevTask, nextTask, newIndexNumber;
        //  Find task to be re-ordered
        const task = await db.task.findFirst({
            where: {
                id: taskId,
            },
            select: {
                indexNumber: true,
            }
        });

        //  Find prev task if exists
        if (prevTaskId) {
            prevTask = await db.task.findFirst({
                where: {
                    id: prevTaskId
                },
                select: {
                    indexNumber: true,
                }
            })
        }
        //  Find next task if exists
        if (nextTaskId) {
            nextTask = await db.task.findFirst({
                where: {
                    id: nextTaskId,
                },
                select: {
                    indexNumber: true,
                }
            })
        }

        if (prevTask && nextTask) {
            newIndexNumber = (prevTask.indexNumber + nextTask.indexNumber) / 2;
        } else if (prevTask && !nextTask) {
            newIndexNumber = prevTask.indexNumber * 2
        } else if (!prevTask && nextTask) {
            newIndexNumber = nextTask.indexNumber / 2
            //  It's going to be first task on a list without tasks
        } else if(!prevTask && !nextTask && task) {
            newIndexNumber = 1040;
        } else {
            throw new Error("Something went wrong.");
        }
        if (newIndexNumber) {
            await db.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    indexNumber: Math.round(newIndexNumber),
                    listId: listId,
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