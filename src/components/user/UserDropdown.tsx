"use client"
import { User } from "next-auth";
import Avatar from "../ui/Avatar";
import SignOutButton from "../auth/SignOutButton";
import Dropdown from "../ui/Dropdown";
import Link from "next/link";

interface UserDropdownProps {
    user: Pick<User, "name" | "email" | "image">
}
const UserDropdown = ({ user }: UserDropdownProps) => {

    return (
        <Dropdown
            isAlignedEnd={true}
            isPrimary={false}
            isLabelStyled={false}
            label={<Avatar userImg={user.image} userName={user.name || user.email!} />}
            additionalInfo={
                <div className="w-full">
                    <div className="mb-2">
                        <p className="uppercase font-medium text-xs">Account</p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <Avatar userImg={user.image} userName={user.name || user.email!} />
                        <div className="flex flex-col  ">
                            {user.name && <p className="font-bold">{user.name}</p>}
                            {user.email && <p className="text-neutral-500 w-40 truncate">{user.email}</p>}
                        </div>
                    </div>
                    <div className="divider my-1"></div>
                </div>
            }
            items={[
                <Link href="/u/profile">Profile</Link>,
                <a>Settings</a>,
                <a>Activity</a>,
                <SignOutButton />
            ]}
        />
    )
}

export default UserDropdown;