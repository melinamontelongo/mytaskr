import CreateBoardForm from "@/components/board/CreateBoardForm";
import Footer from "@/components/ui/Footer";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

const CreateBoardPage = async () => {
    const session = await getAuthSession();
    if (!session?.user) return null;
    //  Get workspaces created by user or where user is a member
    const workspaces = await db.user.findFirst({
        where: {
            id: session.user.id,
        },
        select: {
            workspaces: true,
            createdWorkspaces: true,
        },
    });

    return (<>
        <div className="min-h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5 pt-24 pb-10 box-content">
           <div className="flex flex-col space-y-5">
                <div>
                    <h1 className="font-extrabold text-4xl text-center">Create board</h1>
                </div>
                <CreateBoardForm workspaces={workspaces?.workspaces} createdWorkspaces={workspaces?.createdWorkspaces}/>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default CreateBoardPage;