import { User } from "@prisma/client";
import Avatar from "../ui/Avatar";
import UserProfileBtnModal from "./UserProfileBtnModal";
import UserProfilePicModal from "./UserProfilePicModal";

interface UserProfileProps {
    user: Pick<User, "name" | "email" | "image" | "username">,
}

const UserProfile = ({ user }: UserProfileProps) => {
    return <>
        <h1 className="text-2xl font-bold">Profile</h1>
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
    </>
}

export default UserProfile;