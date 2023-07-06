import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import { getAuthSession } from "@/lib/auth";

const Navbar = async() => {
    const session = await getAuthSession();
    console.log(session)
    return (
        <div className="navbar bg-base-100 shadow-lg h-15 fixed top-0 left-0 right-0">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl font-extrabold sm:text-2xl drop-shadow-md">mytaskr.</Link>
            </div>
            <div className="flex-none gap-2">
                <ThemeToggler />
                {session?.user ? "Welcome!" : 
                
                <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
                }
            </div>
        </div>
    )
}

export default Navbar;