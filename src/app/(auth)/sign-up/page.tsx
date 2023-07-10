import SignUp from "@/components/auth/SignUp";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
    const session = await getAuthSession();
    //  Logged in users cannot access sign up page
    if (session) return redirect("/");
    return (<>
        <div className="h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
            <Link href="/" className="self-start mt-5">
                <div className="flex items-center">
                    <FiChevronLeft />
                    <span>Go back</span>
                </div>
            </Link>
            <SignUp />
        </div>
    </>
    )
}

export default SignUpPage;