import { User } from "next-auth";
import Avatar from "./Avatar";
import SignOutButton from "./auth/SignOutButton";

interface UserDropdownProps {
    user: Pick<User, "name" | "email" | "image">
}

const UserDropdown = ({ user }: UserDropdownProps) => {

    return (
        <>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="">
                    <Avatar userImg={user.image} />
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-fit">
                    {/* ACCOUNT INFO */}
                    <div className="mb-2">
                        <p className="uppercase font-medium text-xs">Account</p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <Avatar userImg={user.image} />
                        <div className="flex flex-col  ">
                            {user.name && <p className="font-bold">{user.name}</p>}
                            {user.email && <p className="text-neutral-500 w-40 truncate">{user.email}</p>}
                        </div>
                    
                    </div>
                    <div className="divider my-1"></div>
                    {/* LINKS */}
                    <div className="flex flex-col gap-2">

                    <li><a>Profile</a></li>
                    
                    <li><a>Settings</a></li>

                    <li><a>Activity</a></li>

                    <li><SignOutButton /></li>
                    </div>
                </ul>
            </div>
        </>
    )
}

export default UserDropdown;