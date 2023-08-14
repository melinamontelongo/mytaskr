import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import UserWorkspacesDisplay from "./UserWorkspacesDisplay";
import UserBoardsDisplay from "./UserBoardsDisplay";
import Footer from "../ui/Footer";

const Dashboard = async () => {
    const session = await getAuthSession();
    const user = await db.user.findUnique({
        where: {
            id: session?.user.id,
        },
        select: {
            name: true,
            email: true,
            workspaces: {
                orderBy: {
                    updatedAt: "desc"
                },
                include: {
                    boards: {
                        orderBy: {
                            updatedAt: "desc"
                        }
                    }
                }
            },
            createdWorkspaces: {
                orderBy: {
                    updatedAt: "desc"
                },
                include: {
                    boards: {
                        orderBy: {
                            updatedAt: "desc"
                        }
                    }
                }
            },
        }
    })
    if (!user) return null;
    return (<>
            <div className="min-h-screen max-w-2xl mx-auto flex flex-col gap-5 pt-24 px-5 box-content">
                <h1 className="text-2xl font-bold">Welcome, {user.name ? user.name : user.email}.</h1>
                <div className="divider"></div>
                <div>
                    <h3 className="text-2xl font-bold">Your workspaces</h3>
                    <div className="flex md:flex-row flex-col md:flex-wrap gap-4 my-4">
                        <UserWorkspacesDisplay workspaces={[...user.workspaces, ...user.createdWorkspaces]} />
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h3 className="text-2xl font-bold">Your boards</h3>
                    <div className="flex md:flex-row flex-col flex-wrap gap-4 my-4">
                        <UserBoardsDisplay workspaces={[...user.workspaces, ...user.createdWorkspaces]} />
                    </div>
                </div>
            </div>
             <Footer />
            </>
    );
};
export default Dashboard;