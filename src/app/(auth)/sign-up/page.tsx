import SignUp from "@/components/auth/SignUp";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
    const session = await getAuthSession();
    //  Logged in users cannot access sign up page
    if (session) return redirect("/");
    return (<>
        <div className="h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
            <SignUp />
        </div>
    </>
    )
}

export default SignUpPage;