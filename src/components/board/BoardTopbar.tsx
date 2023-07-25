import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CreateListBtnModal from "../list/CreateListBtnModal";

interface BoardTopbarProps {
    boardId: string,
}
const BoardTopbar = async ({ boardId }: BoardTopbarProps) => {
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

    return (
        <div className="fixed top-0 left-0 right-0 h-32 z-30">
            <div className="flex md:flex-row justify-evenly items-center h-full my-8 md:pl-48">
                <div className="py-2">
                    <h1 className="font-extrabold text-xl">{board.name}</h1>
                    {board.description && <p>{board.description}</p>}
                </div>
                <CreateListBtnModal boardId={boardId} />
            </div>
        </div>
    )
}

export default BoardTopbar;