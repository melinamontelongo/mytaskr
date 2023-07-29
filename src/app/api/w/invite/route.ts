import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { WorkspaceInvite } from "@/lib/validators";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { invitedUsers, workspaceId } = WorkspaceInvite.parse(body)
        //  Find workspace
        const workspace = await db.workspace.findFirst({
            where: {
                id: workspaceId,
            }
        });
        if(!workspace) return new Response("Workspace not found.",  { status: 404 });

        const usersToInvite: string[] = [];
        //  If workspace already has users
        if(workspace?.usersIDs && workspace?.usersIDs?.length > 0){
            //  Filter those who may already be a member (controlled client-side too)
            workspace?.usersIDs.map((userID) => {
                invitedUsers.forEach((invitedID) => {
                    if (userID !== invitedID && userID !== session.user.id) {
                        usersToInvite.push(userID);
                    }
                    return;
                })
            }); 
        } else {
            invitedUsers.forEach((invitedID) => {
                if(invitedID !== session.user.id){
                    usersToInvite.push(invitedID);
                }
                return;
            })
        }
        await db.workspace.update({
            where: {
                id: workspaceId,
            },
            data: {
                usersIDs: {
                    push: usersToInvite,
                },
                users: {
                    connect: usersToInvite.map(i => ({ id: i })) || [],
                },
                activity: {
                    createMany: {
                        data: usersToInvite.map(i => {
                            return {
                                workspaceId: workspace.id,
                                userID: i,
                                type: "JoinedWorkspace",
                                name: workspace.name,
                                description: "Joined workspace",
                            }
                        })
                    }
                }
            }
        });
        return new Response("Invitations sent successfully!");

    } catch (e) {
        if (e instanceof z.ZodError) {
            //  Wrong data was sent
            return new Response("Invalid request data passed.", { status: 422 })
        }
        return new Response("Could not create send invitations, please try again later.", { status: 500 })
    }
}