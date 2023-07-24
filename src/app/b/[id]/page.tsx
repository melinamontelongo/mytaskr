import BoardDisplay from "@/components/display/BoardDisplay";
import CreateListBtnModal from "@/components/create/CreateListBtnModal";
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
        <div className="max-h-screen mx-auto flex flex-col gap-5 md:pt-24 pt-24 box-content">
            <div className="overflow-x-auto overflow-y-hidden max-h-screen h-[calc(100vh-11rem)]">
                <div className="flex flex-col">
                    <BoardDisplay board={board} />
                </div>
            </div>
        </div>
    )
}

export default BoardPage;