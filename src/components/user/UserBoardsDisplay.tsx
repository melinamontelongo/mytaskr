import { Board, Workspace } from "@prisma/client";
import Link from "next/link";
import DisplayCard from "../ui/DisplayCard";
import React from "react";

interface ExtendedWorkspace extends Workspace {
    boards: Board[]
}
interface UserBoardsDisplayProps {
    workspaces: ExtendedWorkspace[]
}
const UserBoardsDisplay = ({ workspaces }: UserBoardsDisplayProps) => {
    return (<>
        {workspaces.length > 0 ? workspaces.map((w) => {
            return (
                <React.Fragment key={`workspaces${w.id}`}>
                    {w.boards.length > 0 ? w.boards.map((board) => {
                        return (
                            <DisplayCard key={board.id} linkHref={`/b/${board.id}`} title={board.name} text={board.description} />
                        )
                    })
                        :
                        <p>You have no boards. <Link href="b/create" className="font-bold text-primary hover:text-base-content">Create one.</Link></p>
                    }
                </React.Fragment>
            )
        })
        :
        <p>You have no boards. <Link href="b/create" className="font-bold text-primary hover:text-base-content">Create one.</Link></p>
    }
    </>)
}

export default UserBoardsDisplay;