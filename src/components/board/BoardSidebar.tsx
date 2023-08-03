import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import VisibilityDisplay from "../ui/VisibilityDisplay";

interface BoardSidebarProps {
    boardId: string,
}
const BoardSidebar = async ({ boardId }: BoardSidebarProps) => {
    const board = await db.board.findFirst({
        where: {
            id: boardId,
        },
        select: {
            name: true,
            description: true,
            workspaceID: true,
        }
    });
    if (!board) return notFound();
    const workspace = await db.workspace.findFirst({
        where: {
            id: board.workspaceID,
        },
        select: {
            id: true,
            name: true,
            isPublic: true,
        }
    });
    if (!workspace) return null;
    return (<>
        {/* bigger screens */}
        <div className="fixed top-0 bottom-0 left-0 w-44 bg-base-200 md:flex hidden items-center justify-center shadow-sm">
            <div className="flex flex-col px-4">
                <Link href={`/w/${workspace.id}`} className="text-left font-bold text-xl">
                    {workspace.name}
                </Link>

                <VisibilityDisplay isPublic={workspace.isPublic} />
                <div className="divider"></div>
            </div>

        </div >
    </>)
}

export default BoardSidebar;