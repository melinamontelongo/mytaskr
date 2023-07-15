import BoardDisplay from "@/components/BoardDisplay";
import CreateListBtnModal from "@/components/CreateListBtnModal";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface BoardPageProps {
    params: {
        id: string,
    }
}

const BoardPage = async ({ params }: BoardPageProps) => {
    const board = await db.board.findFirst({
        where: {
            id: params.id
        },
        include: {
            lists: {
                orderBy: {
                    indexNumber: "asc"
                },
                include: {
                    tasks: {
                        orderBy: {
                            indexNumber: "asc",
                        }
                    },
                }
            }
        },
    })
    if (!board) return notFound();
    return (
        <div className="h-screen max-w-4xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
            <h1 className="font-extrabold text-xl">{board.name}</h1>
            <CreateListBtnModal boardId={params.id} />
            <div className="overflow-x-auto overflow-y-hidden">
                <div className="flex flex-col">
                    <BoardDisplay board={board} />
                </div>
            </div>
        </div>
    )
}

export default BoardPage;