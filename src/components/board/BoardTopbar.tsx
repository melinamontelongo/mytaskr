import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CreateListBtnModal from "../list/CreateListBtnModal";
import BoardSettingsBtnModal from "./BoardSettingsBtnModal";

interface BoardTopbarProps {
    boardId: string,
}
const BoardTopbar = async ({ boardId }: BoardTopbarProps) => {
    const board = await db.board.findFirst({
        where: {
            id: boardId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            workspaceID: true,
        }
    });
    if (!board) return notFound();

    return (
        <div className="fixed top-14 left-0 h-14 right-0 z-30">
            <div className="flex flex-row justify-evenly items-center h-full my-8 md:pl-48">
                <div className="py-2">
                    <h1 className="font-extrabold text-xl">{board.name}</h1>
                    {board.description && <p>{board.description}</p>}
                </div>
                <div className="flex flex-row justify-evenly items-center gap-2 flex-wrap">
                    <div>
                        <BoardSettingsBtnModal boardId={board.id} boardName={board.name} boardDescription={board.description} />
                    </div>
                    <div>
                        <CreateListBtnModal boardId={boardId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardTopbar;