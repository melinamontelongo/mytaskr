import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { dateFormatter } from "@/lib/dateFormatter";

const UserProfileActivity = async () => {
    const session = await getAuthSession();
    if (!session) return null;
    const user = await db.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            activity: {
                include: {
                    workspace: true,
                    board: {
                        include: {
                            workspace: true,
                        }
                    },
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
        }
    })

    return (
        <ul className="flex flex-col gap-4">
            {user?.activity.map((a) => {
                return (
                    <li key={a.id}>
                        <p>{a.description} { }
                            {a.type.includes("Board") &&
                                (a.boardId ? <><Link className="font-bold text-primary hover:underline" href={`/b/${a.boardId}`}>{a.name}</Link> on <Link className="font-bold text-primary hover:underline" href={`/w/${a.board?.workspaceID}`}>{a.board?.workspace.name}</Link></>
                                    :
                                    <>
                                        <span className="font-bold text-neutral-500">{a.name}</span>
                                        {a.board?.workspaceID ? <>on <Link href={a.board?.workspaceID}>{a.board?.workspace.name}</Link></>
                                            :
                                            a.board?.workspace.name && <> on <span className="font-bold text-neutral-500">{a.board?.workspace.name}</span></>
                                        }
                                    </>
                                )}
                            {a.type.includes("Workspace") &&
                                (a.workspaceId ? <Link className="font-bold text-primary hover:underline" href={`/w/${a.workspaceId}`}>{a.name}</Link>
                                    :
                                    <span className="font-bold text-neutral-500">{a.name}</span>)}
                        </p>
                        <p className="text-sm">{dateFormatter(a.createdAt)}</p>
                    </li>
                )
            })}
        </ul>
    )
}

export default UserProfileActivity;