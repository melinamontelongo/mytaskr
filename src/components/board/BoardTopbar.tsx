import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AiOutlineSetting } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import BoardSettingsModal from "./BoardSettingsModal";
import CreateListModal from "../list/CreateListModal";
import VisibilityDisplay from "../ui/VisibilityDisplay";

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
            workspace: {
                select: {
                    name: true,
                    isPublic: true,
                }
            }
        }
    });
    if (!board) return notFound();

    return (<>
        <div className="fixed top-14 left-0 h-fit right-0 backdrop-blur-sm bg-base-200/50">
            <div className="flex flex-row justify-evenly items-center h-full py-4 md:pl-48">
                <div className="sm:py-2 pl-2">
                    <h1 className="font-extrabold text-xl">{board.name}</h1>
                    {board.description && <p className="w-32 sm:w-44 md:w-60 lg:w-80 xl:w-96 text-xs truncate">{board.description}</p>}
                    <div className="md:hidden text-xs">
                        <p>{board.workspace.name}</p>
                        <VisibilityDisplay isPublic={board.workspace.isPublic} />
                    </div>
                </div>
                <div className="flex flex-row justify-evenly items-center sm:gap-2 gap-1 flex-wrap">
                    <div>
                        <label htmlFor={"boardSettings"} className="btn btn-sm bg-base-200 normal-case w-full border-none flex items-center justify-center rounded">
                            <AiOutlineSetting className="text-base-content text-xl" />
                            <span className="hidden sm:block">Settings</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor={"createListModal"} className="btn btn-sm bg-base-200 normal-case w-full border-none flex items-center justify-center rounded">
                            <IoMdAdd className="text-base-content text-xl" />
                            <span className="hidden sm:block">Add list</span>
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