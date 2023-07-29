import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";

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
                    board: true,
                }
            },
        }
    })

    return (
        <ul className="flex flex-col gap-2">
            {user?.activity.map((a) => {
                console.log(a)
                return (
                    <li key={a.id}>
                        <p>{a.description} { }
                            {a.type.includes("Board") && <Link className="font-bold text-primary hover:underline" href={`/b/${a.boardId}`}>{a.name}</Link>}
                            {a.type.includes("Workspace") && <Link className="font-bold text-primary hover:underline" href={`/w/${a.workspaceId}`}>{a.name}</Link>}
                        </p>
                        <p className="text-sm">{format(new Date(a.createdAt), "MMM d',' yyy 'at' HH':'m")}</p>
                    </li>
                )
            })}
        </ul>
    )
}

export default UserProfileActivity;