import Avatar from "@/components/ui/Avatar";
import DisplayCard from "@/components/ui/DisplayCard";
import InviteToWorkspace from "@/components/InviteToWorkspace";
import { db } from "@/lib/db";
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
                    image: true,
                }
            }
        }
    });

    if (!workspace) return notFound();
    console.log(workspace)
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
                </div>
                <div>

                </div>
            </div>

            <div className="divider"></div>
            {/* BOARDS */}
            <div className="flex flex-row items-center justify-between">
                <h3 className="font-extrabold text-xl">Boards</h3>
                <div className="w-32">
                    <Link className="btn bg-base-300 normal-case w-full rounded" href="/b/create">Create board</Link>
                </div>
            </div>
            <div className="flex md:flex-row flex-col md:flex-wrap gap-4 my-4">
                {workspace.boards.length > 0 ? workspace.boards.map((board) => {
                    return <DisplayCard key={board.id} linkHref={`/b/${board.id}`} title={board.name} text={board.description} />
                }) :
                    <p>No boards in this workspace.</p>
                }
            </div>
            {/* MEMBERS */}
            <div className="flex flex-row items-center justify-between">
                <h3 className="font-extrabold text-xl">Members</h3>
                <div className="w-32">
                    <InviteToWorkspace workspaceId={params.id} />
                </div>
            </div>
            <div className="flex md:flex-row flex-col md:flex-wrap gap-10 my-4">

                <div className="flex items-center gap-2">
                    <Avatar userImg={workspace.createdBy.image} userName={workspace.createdBy.name || workspace.createdBy.email!} />
                    <span>{workspace.createdBy.name ?? workspace.createdBy.email} (Author)</span>
                </div>
                
                {workspace.users.length > 0 ? workspace.users.map((user) => {
                    return (
                        <div key={user.id} className="flex items-center gap-2">
                            <Avatar userImg={user.image} userName={user.name || user.email!} />
                            {user.email}
                        </div>
                    )
                })
                    :
                    <p>No invited users in this workspace.</p>
                }
            </div>
        </div>
    )
}

export default WorkspacePage;