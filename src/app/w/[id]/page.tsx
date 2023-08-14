import Avatar from "@/components/ui/Avatar";
import DisplayCard from "@/components/ui/DisplayCard";
import PrivatePage from "@/components/ui/PrivatePage";
import InviteToWorkspace from "@/components/workspace/InviteToWorkspace";
import UninviteUserBtn from "@/components/workspace/UninviteUserBtn";
import WorkspaceSettingsBtnModal from "@/components/workspace/WorkspaceSettingsBtnModal";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";

interface WorkspacePageProps {
    params: {
        id: string,
    }
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
    const session = await getAuthSession();
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
            },
        }
    });

    if (!workspace) return notFound();
    if (!session?.user) return null;
    //  Not displaying if workspace is private and user is not a member
    if ((session.user.id !== workspace.createdBy.id && !workspace.usersIDs.includes(session.user.id)) && !workspace.isPublic) return <PrivatePage page={"workspace"} />
    return (
        <div className="min-h-screen h-full max-w-2xl mx-auto flex flex-col gap-5 pt-24 px-5 box-content">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between justify-start gap-5">
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

                    {workspace.description &&
                        <div className="">
                            <p>{workspace.description}</p>
                        </div>
                    }
                </div>

                <div className="w-52 sm:w-32">
                    <WorkspaceSettingsBtnModal
                        workspaceId={workspace.id}
                        workspaceName={workspace.name}
                        workspaceDescription={workspace.description}
                        isPublic={workspace.isPublic}
                        isMember={session.user.id === workspace.createdBy.id || workspace.usersIDs.includes(session.user.id)}
                    />
                </div>
            </div>


            <div className="divider"></div>

            {/* BOARDS */}

            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5">
                <h3 className="font-extrabold text-xl">Boards</h3>
                <div className="w-52 sm:w-32">
                    <button
                        className="btn bg-base-300 normal-case w-full border-none rounded"
                        disabled={session.user.id !== workspace.createdBy.id && !workspace.usersIDs.includes(session.user.id)}>
                        <Link className="flex items-center justify-center " href="/b/create"><IoMdAdd className="enabled:text-base-content text-xl" />  Create</Link>
                    </button>
                </div>
            </div>
            <div className="flex md:flex-row flex-col md:flex-wrap gap-4 my-4">
                {workspace.boards.length > 0 ? workspace.boards.map((board) => {
                    return <DisplayCard key={board.id} linkHref={`/b/${board.id}`} title={board.name} text={board.description} backgroundImageSrc={board.backgroundImageSmall} />
                }) :
                    <p>No boards in this workspace.</p>
                }
            </div>
            {/* MEMBERS */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5">
                <h3 className="font-extrabold text-xl">Members</h3>
                <div className="w-52 sm:w-32">
                    <InviteToWorkspace workspaceId={params.id} isMember={session.user.id === workspace.createdBy.id || workspace.usersIDs.includes(session.user.id)} />
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
                            {user.email} {session?.user.id === workspace.creatorId && <UninviteUserBtn userId={user.id} workspaceId={workspace.id} />}
                        </div>
                    )
                })
                    :
                    <div className="flex items-center gap-2">
                        <p>No invited users in this workspace.</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default WorkspacePage;