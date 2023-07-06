import SignIn from "@/components/auth/SignIn";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

const SignInPage = () => {
    return (<>
        <div className="h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
          <Link href="/" className="self-start mt-5">
                <div className="flex items-center">
                    <FiChevronLeft />
                    <span>Go back</span>
                </div>
            </Link> 
            <SignIn />
        </div>
    </>
    )
}

export default SignInPage;