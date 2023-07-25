import BoardSidebar from "@/components/board/BoardSidebar";
import BoardTopbar from "@/components/board/BoardTopbar";
import CreateListBtnModal from "@/components/list/CreateListBtnModal";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface BoardLayoutProps {
    children: React.ReactNode,
    params: {
        id: string,
    }
}

const BoardLayout = ({ children, params }: BoardLayoutProps) => {
    return (
        <div className="pt-16 max-h-screen h-screen">
            {/* TOP BAR */}
            <BoardTopbar boardId={params.id} />
            {/* SIDEBAR */}
            <BoardSidebar boardId={params.id} />
            <div className="md:pl-48 pl-2">
                {children}
            </div>
        </div>
    )
}

export default BoardLayout;