import UserProfile from "@/components/user/UserProfile";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

const ProfilePage = async () => {
    const session = await getAuthSession();

    const user = await db.user.findUnique({
        where: {
            id: session?.user.id,
        },
        select: {
            name: true,
            email: true,
            username: true,
            image: true,
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
    
    return (
        <>
            <div className="h-full max-w-2xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
                <UserProfile user={user}/>
            </div>
        </>
    )

}

export default ProfilePage;