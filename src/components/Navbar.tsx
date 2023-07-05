import Link from "next/link";
import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">mytaskr</Link>
            </div>
            <div className="flex-none">
                <ThemeToggler />
            </div>
        </div>
    )
}

export default Navbar;