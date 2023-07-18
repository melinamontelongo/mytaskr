import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import { getAuthSession } from "@/lib/auth";
import UserDropdown from "./UserDropdown";
import WorkspacesDropdown from "./WorkspacesDropdown";
import CreateDropdown from "./CreateDropdown";

const Navbar = async () => {
    const session = await getAuthSession();
    return (
        <div className="navbar bg-base-100 shadow-lg h-14 fixed top-0 left-0 right-0 z-50">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl font-extrabold sm:text-2xl drop-shadow-md">mytaskr.</Link>
                {session && (<>
                    <WorkspacesDropdown userId={session.user.id} />
                    <CreateDropdown />
                </>)}
            </div>
            <div className="flex-none gap-2">
                <ThemeToggler />
                {session ? <UserDropdown user={session.user} /> :

                    <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
                }
            </div>
        </div>
    )
}

export default Navbar;