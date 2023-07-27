import { Workspace } from "@prisma/client";
import Link from "next/link";
import DisplayCard from "../ui/DisplayCard";

interface UserWorkspacesDisplayProps{
    workspaces: Workspace[]
}
const UserWorkspacesDisplay = ({workspaces}:UserWorkspacesDisplayProps) => {
    return(<>
        {workspaces.length > 0 ? (<>
            {workspaces?.map((w) => {
                return (
                    <DisplayCard key={w.id} linkHref={`/w/${w.id}`} title={w.name} text={w.description} />
                )
            })}
        </>)
            :
            <p>You have no workspaces. <Link href="w/create" className="font-bold text-primary hover:text-base-content">Create one.</Link></p>
        }
    </>)
}

export default UserWorkspacesDisplay;