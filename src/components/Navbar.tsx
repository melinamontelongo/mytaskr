import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import { getAuthSession } from "@/lib/auth";
import UserDropdown from "./UserDropdown";
import WorkspacesDropdown from "./WorkspacesDropdown";
import CreateDropdown from "./CreateDropdown";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import { RiTableFill } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";

const Navbar = async () => {
    const session = await getAuthSession();
    return (
        <div className="navbar bg-base-100 shadow-lg h-14 fixed top-0 left-0 right-0 z-50">

            {/* bigger screens */}
            <div className="md:flex md:flex-1 hidden">
                <Link href="/" className="btn btn-ghost normal-case font-extrabold text-2xl drop-shadow-md rounded">mytaskr.</Link>
                {session && (<>
                    <Link className="btn btn-ghost normal-case rounded flex gap-2 items-center" href="/"><AiFillHome /> Home</Link>
                    <WorkspacesDropdown userId={session.user.id} />
                    <CreateDropdown />
                </>)}
            </div>
            <div className="md:flex md:flex-none md:gap-2 hidden">
                <ThemeToggler />
                {session ? <UserDropdown user={session.user} /> :

                    <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
                }
            </div>

            {/* smaller screens */}
            <div className="md:hidden flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-2xl font-extrabold drop-shadow-md rounded">mytaskr.</Link>
                {session && (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost m-1" role="menu" aria-label="navigation"><GiHamburgerMenu className="text-xl" /></label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <>
                                <li><Link className="font-bold" href="/"><AiFillHome /> Home</Link></li>
                                <li><Link className="font-bold" href="/w/create"><BsPersonWorkspace />Create workspace</Link></li>
                                <li><Link className="font-bold" href="/b/create"><RiTableFill />Create board</Link></li>
                            </>
                        </ul>
                    </div>
                )}
            </div>
            <div className="md:hidden flex-none">
                {session ? <UserDropdown user={session.user} /> :

                    <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
                }
            </div>
        </div>
    )
}

export default Navbar;