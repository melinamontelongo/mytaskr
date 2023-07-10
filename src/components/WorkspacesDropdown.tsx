import { db } from "@/lib/db";
import { User } from "next-auth";
import { BiChevronDown } from "react-icons/bi"

interface WorkspaceDropdown {
    userId: string,
}
const WorkspacesDropdown = async ({ userId }: WorkspaceDropdown) => {
    //  Workspaces where user is either a creator or a member
    const workspaces = await db.workspace.findMany({
        where: {
            OR: [
                { creatorId: userId },
                {
                    usersIDs: {
                        has: userId,
                    }
                }
            ]
        }
    })
    return (
        <div className="dropdown">
            <label tabIndex={0} className="m-1 btn btn-ghost normal-case">Workspaces <BiChevronDown /></label>
            <ul tabIndex={0} className="p-2 shadow-md menu dropdown-content z-[1] bg-base-100 border border-base-200 rounded-box w-52">
                <div className="mb-2">
                    <p className="uppercase font-medium text-xs">Your workspaces</p>
                </div>
                <div className="divider my-0"></div>
                {workspaces && workspaces?.length > 0 ? workspaces?.map((w) => {
                    return <p key={w.id}>{w.name}</p>
                })
                    :
                    <p>You do not have any workspace yet.</p>
                }
            </ul>
        </div>
    )
}

export default WorkspacesDropdown;