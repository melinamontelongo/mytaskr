import BoardDisplay from "@/components/board/BoardDisplay";
import PrivatePage from "@/components/ui/PrivatePage";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface BoardPageProps {
    params: {
        id: string,
    }
}

const BoardPage = async ({ params }: BoardPageProps) => {
    const session = await getAuthSession();
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
            },
            workspace: {
                select: {
                    createdBy: true,
                    usersIDs: true,
                    isPublic: true,
                }
            }
        },
    })
    if (!board) return notFound();
    if(!session?.user) return null;
    //  Not displaying if board if workspace is private and user is not a member
    if ((session.user.id !== board.workspace.createdBy.id && !board.workspace.usersIDs.includes(session.user.id)) && !board.workspace.isPublic) return <PrivatePage page={"board"} />
    return (
        <div className="max-h-screen mx-auto flex flex-col gap-5 md:pt-24 pt-32 box-content">
            <div className="overflow-x-auto overflow-y-hidden max-h-screen h-[calc(100vh-11rem)]">
                <div className="flex flex-col">
                    <BoardDisplay board={board} />
                </div>
            </div>
        </div>
    )
}

export default BoardPage;