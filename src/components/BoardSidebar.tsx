import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

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
    if(!workspace) return null;
    return (<>
        {/* bigger screens */}
        <div className="fixed top-0 bottom-0 left-0 w-44 bg-base-100 md:flex hidden items-center justify-center ">
            <div className="flex flex-col">
                <Link href={`/w/${workspace.id}`} className="text-left font-bold text-xl">
                    {workspace.name}
                </Link>
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
                <div className="divider"></div>
            </div>

        </div >
    </>)
}

export default BoardSidebar;