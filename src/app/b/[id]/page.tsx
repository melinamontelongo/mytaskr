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
                include: {
                    tasks: true,
                }
            }
        }
    })
    if (!board) return notFound();
    console.log("lists", board.lists)
    return (
        <div className="h-screen max-w-2xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
            <h1 className="font-extrabold text-xl">{board.name}</h1>
            <CreateListBtnModal boardId={params.id} />
        </div>
    )
}

export default BoardPage;