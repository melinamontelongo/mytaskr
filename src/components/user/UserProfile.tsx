import Avatar from "../ui/Avatar";
import UserProfileBtnModal from "./UserProfileBtnModal";
import UserProfilePicModal from "./UserProfilePicModal";
import UserProfileActivity from "./UserProfileActivity";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

const UserProfile = async () => {
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
    });

    if (!session?.user || !user) return null;

    const activityCount = await db.activity.count({
        where: {
            userID: session.user.id
        }
    });

    const activity = await db.activity.findMany({
        where: {
            userID: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            type: true,
            boardId: true,
            workspaceId: true,
            name: true,
            description: true,
            createdAt: true,
            userID: true,
            board: {
                include: {
                    workspace: true,
                }
            }
        },
        take: 5,
    });

    return <>
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="flex items-center justify-start gap-2">
            <div className="tooltip" data-tip="Change profile picture">
                <label className="cursor-pointer" htmlFor="userProfilePicModal">
                    <Avatar userImg={user.image} userName={user.name || user.email!} />
                </label>
            </div>
            <div className="flex flex-col">
                {user.name && <p className="font-bold">{user.name}</p>}
                {user.email && <p className="text-neutral-500 w-40 truncate">{user.email}</p>}
                {user.username && <p className="text-neutral-500 text-xs w-40 truncate">@{user.username}</p>}
            </div>
            <UserProfileBtnModal user={user} />

            <UserProfilePicModal />
        </div>
        <div className="divider"></div>
        <h2 className="text-2xl font-bold">Activity</h2>
        <div className="flex items-center justify-start gap-2 mb-5">
            <UserProfileActivity initialActivity={{count: activityCount, activity} ?? null} />
        </div>
    </>
}

export default UserProfile;