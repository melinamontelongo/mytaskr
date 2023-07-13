
import InviteToWorkspace from "@/components/InviteToWorkspace";
import { db } from "@/lib/db";
import { transformDocument } from "@prisma/client/runtime";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

interface WorkspacePageProps {
    params: {
        id: string,
    }
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {

    const workspace = await db.workspace.findFirst({
        where: {
            id: params.id,
        },
        include: {
            users: true,
            boards: true,
            createdBy: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    username: true,
                }
            }
        }
    });

    if (!workspace) return notFound();

    return (
        <div className="h-screen max-w-2xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
            <div className="flex flex-col sm:flex-row justify-center sm:gap-20 sm:items-center gap-5 px-5">
                <div>
                    <h1 className="font-extrabold text-xl">{workspace.name}</h1>
                    <div className="flex items-center">{workspace.isPublic ?
                        <>
                            <BiLockOpenAlt />
                            <span className="text-sm">
                                Public
                            </span>
                        </>
                        :
                        <>
                            <BiLockAlt />
                            <span className="text-sm">
                                Private
                            </span>
                        </>
                    }
                    </div>
                    <div>Created by {workspace.createdBy.email}</div>
                </div>
                <div>
                    A
                </div>
            </div>

            <div className="divider"></div>
            {/* BOARDS */}
            <div className="flex flex-row items-center justify-between">
                <h3 className="font-extrabold text-xl">Boards</h3>
                <div className="w-32">
                <Link className="btn bg-base-300 normal-case w-full" href="/b/create">Create board</Link>
                </div>
            </div>
            <div>
                <ul>
                    {workspace.boards.length > 0 ? workspace.boards.map((board) => {
                        return <li key={board.id}>{board.name}</li>
                    }) :
                        <p>No boards in this workspace.</p>
                    }
                </ul>
            </div>
            {/* MEMBERS */}
            <div className="flex flex-row items-center justify-between">
                <h3 className="font-extrabold text-xl">Members</h3>
                <div className="w-32">
                    <InviteToWorkspace workspaceId={params.id} />
                </div>
            </div>
            <div>
                <ul>
                    {workspace.users.map((user) => {
                        return <li key={user.id}>{user.email}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default WorkspacePage;