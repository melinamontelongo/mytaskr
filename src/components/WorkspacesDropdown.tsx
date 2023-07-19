import { db } from "@/lib/db";
import Link from "next/link";
import { BiChevronDown } from "react-icons/bi"
import { BsPersonWorkspace } from "react-icons/bs";

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
        <div className="dropdown" role="menu">
            <label tabIndex={0} className="m-1 btn btn-ghost normal-case rounded"><BsPersonWorkspace /> Workspaces <BiChevronDown /></label>
            <ul tabIndex={0} className="p-2 shadow-md menu dropdown-content z-[1] bg-base-100 border border-base-200 rounded-box w-52">
                <div className="mb-2">
                    <p className="uppercase font-medium text-xs">Your workspaces</p>
                </div>
                <div className="divider my-0"></div>
                {workspaces && workspaces?.length > 0 ? workspaces?.map((w) => {
                    return (
                    <li key={w.id} role="menuitem">
                        <Link
                            className="font-bold"
                            href={`/w/${w.id}`}>
                            {w.name}
                        </Link>
                    </li>
                    )
                })
                    :
                    <li>You do not have any workspace yet.</li>
                }
            </ul>
        </div>
    )
}

export default WorkspacesDropdown;