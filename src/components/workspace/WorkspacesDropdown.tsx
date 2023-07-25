import { db } from "@/lib/db";
import Link from "next/link";
import { BiChevronDown } from "react-icons/bi"
import { BsPersonWorkspace } from "react-icons/bs";
import Dropdown from "../ui/Dropdown";

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
        <Dropdown
            isPrimary={false}
            isLabelStyled={true}
            label={<><BsPersonWorkspace /> Workspaces <BiChevronDown /></>}
            items={[
                <> {workspaces && workspaces?.length > 0 ? workspaces?.map((w) => {
                    return (
                            <Link key={w.id}
                                className=""
                                href={`/w/${w.id}`}>
                                {w.name}
                            </Link>
                    )
                })
                    :
                    <>You do not have any workspace yet</>
                }</>
            ]}

        />
    )
}

export default WorkspacesDropdown;