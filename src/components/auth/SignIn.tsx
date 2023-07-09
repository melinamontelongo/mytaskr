import Link from "next/link";
import SignInForm from "./SignInForm";

const SignIn = () => {
    return (
        <div className="flex flex-col space-y-5">
            <div>
                <h1 className="font-extrabold text-4xl text-center">Sign in</h1>
            </div>
            <div>
                <SignInForm />
            </div>
            <div>
                <p className="text-center">
                    New to mytaskr? <Link className="underline text-primary" href="/sign-up">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default SignIn;