
import InviteToWorkspace from "@/components/InviteToWorkspace";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

interface WorkspacePageProps {
    params: {
        id: string,
    }
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {

    const workspace = await db.workspace.findFirst({
        where: {
            id: params.id,
        },
        include: {
            users: true,
            boards: true,
        }
    });

    if (!workspace) return notFound();

    return (
        <div className="h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5 md:pt-4 pt-36 box-content">
            <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                <div>
                    <h1 className="font-extrabold text-xl">{workspace.name}</h1>
                    <div className="flex items-center">{workspace.isPublic ?
                        <>
                            <BiLockOpenAlt />
                            <span className="text-sm">
                                Public
                            </span>
                        </>
                        :
                        <>
                            <BiLockAlt />
                            <span className="text-sm">
                                Private
                            </span>
                        </>
                    }
                    </div>
                </div>
                <div>
                    <InviteToWorkspace workspaceId={params.id}/>
                </div>
            </div>
        </div>
    )
}

export default WorkspacePage;