import SignIn from "@/components/auth/SignIn";
import Footer from "@/components/ui/Footer";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
    const session = await getAuthSession();
    //  Logged in users cannot access sign in page
    if (session) return redirect("/");
    return (<>
        <div className="h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
            <SignIn />
        </div>
        <Footer />
    </>
    )
}

export default SignInPage;