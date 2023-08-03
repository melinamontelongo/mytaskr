import BoardSidebar from "@/components/board/BoardSidebar";
import BoardTopbar from "@/components/board/BoardTopbar";
import { db } from "@/lib/db";

interface BoardLayoutProps {
    children: React.ReactNode,
    params: {
        id: string,
    }
}

const BoardLayout = async({ children, params }: BoardLayoutProps) => {
    const backgroundImage = await db.board.findUnique({
        where: {
            id: params.id,
        },
        select: {
            backgroundImageFull: true,
        }
    });
    return (
        <div className={`pt-16 max-h-screen h-screen bg-cover bg-center`} style={{backgroundImage: `url('${backgroundImage?.backgroundImageFull}')`}}>
            {/* TOP BAR */}
            <BoardTopbar boardId={params.id} />
            {/* SIDEBAR */}
            <BoardSidebar boardId={params.id} />
            <div className="md:pl-48 pl-2 pt-8 sm:pt-0">
                {children}
            </div>
        </div>
    )
}

export default BoardLayout;