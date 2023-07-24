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
import Dropdown from "./ui/Dropdown";

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
                    <Dropdown 
                        isPrimary={false}
                        isAlignedEnd={true}
                        isLabelStyled={true}
                        label={<GiHamburgerMenu className="text-xl" />}
                        items={[
                            <Link className="font-bold" href="/"><AiFillHome /> Home</Link>,
                            <Link className="font-bold" href="/w/create"><BsPersonWorkspace />Create workspace</Link>,
                            <Link className="font-bold" href="/b/create"><RiTableFill />Create board</Link>,
                            <ThemeToggler />
                        ]}
                    />
                )}
            </div>
            <div className="md:hidden flex-none">
                {session ? <UserDropdown user={session.user} />
                    :
                    <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
                }
            </div>
        </div>
    )
}

export default Navbar;