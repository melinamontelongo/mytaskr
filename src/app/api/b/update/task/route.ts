import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { TaskUpdate } from "@/lib/validators";
import { z } from "zod";

export async function PUT(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, taskId } = TaskUpdate.parse(body);

        const task = await db.task.findUnique({
            where: {
                id: taskId,
            },
            select: {
                list: {
                    select: {
                        board: {
                            select: {
                                workspace: {
                                    select: {
                                        creatorId: true,
                                        usersIDs: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!task) return new Response("Task not found", { status: 404 });
        if (!(session.user.id === task.list.board.workspace.creatorId) && !task.list.board.workspace.usersIDs.includes(session.user.id)) return new Response("Only workspace members can edit tasks", { status: 403 });

        await db.task.update({
            where: {
                id: taskId,
            },
            data: {
                name, description
            }
        });

        return new Response("List updated successfully!");
    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 });
        }
        return new Response("Could not create list, please try again later.", { status: 500 });
    }
};

export async function DELETE(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const url = new URL(req.url);
        const taskId = url.searchParams.get("id");
        if (!taskId) return new Response("Invalid query", { status: 400 });
        
        const task = await db.task.findUnique({
            where: {
                id: taskId,
            },
            select: {
                list: {
                    select: {
                        board: {
                            select: {
                                workspace: {
                                    select: {
                                        creatorId: true,
                                        usersIDs: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!task) return new Response("Task not found", { status: 404 });
        if (!(session.user.id === task.list.board.workspace.creatorId) && !task.list.board.workspace.usersIDs.includes(session.user.id)) return new Response("Only workspace members can delete tasks", { status: 403 });

        await db.task.delete({
            where: {
                id: taskId,
            },
        })
        return new Response("Task deleted successfully!");
    } catch (e) {
        return new Response("Could not delete task, please try again later.", { status: 500 });
    }
};