import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AiOutlineSetting } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import BoardSettingsModal from "./BoardSettingsModal";
import CreateListModal from "../list/CreateListModal";

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
            backgroundImageFull: true,
            backgroundImageSmall: true,
        }
    });
    if (!board) return notFound();

    return (<>
        <div className="fixed top-14 left-0 h-fit right-0 backdrop-blur-sm bg-base-300/30">
            <div className="flex flex-row justify-evenly items-center h-full py-4 md:pl-48">
                <div className="sm:py-2 pl-2">
                    <h1 className="font-extrabold text-xl">{board.name}</h1>
                    {board.description && <p>{board.description}</p>}
                </div>
                <div className="flex flex-row justify-evenly items-center sm:gap-2 gap-1 flex-wrap">
                    <div>
                        <label htmlFor={"boardSettings"} className="btn btn-sm bg-base-300 normal-case w-full border-none flex items-center justify-center rounded">
                            <AiOutlineSetting className="text-base-content text-xl" /> Settings
                        </label>
                    </div>
                    <div>
                        <label htmlFor={"createListModal"} className="btn btn-sm bg-base-300 normal-case w-full border-none flex items-center justify-center rounded">
                            <IoMdAdd className="text-base-content text-xl" />
                            Add list
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <BoardSettingsModal
            boardId={board.id}
            boardName={board.name}
            boardDescription={board.description}
            boardImages={{ backgroundImageFull: board.backgroundImageFull, backgroundImageSmall: board.backgroundImageSmall }}
        />
        <CreateListModal boardId={boardId} />

    </>)
}

export default BoardTopbar;