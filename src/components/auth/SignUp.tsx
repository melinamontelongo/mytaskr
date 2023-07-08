import Link from "next/link";
import SignUpForm from "./SignUpForm";

const SignUp = async() => {
    return (
        <div className="space-y-5 flex flex-col justify-items-center">
            <div>
                <h1 className="font-extrabold text-4xl text-center">Sign up</h1>
            </div>
            <div className="flex flex-col justify-items-center">
                <SignUpForm />
            </div>
            <div>
                <p className="text-center">
                    Already have a mytaskr account? <Link className="underline" href="/sign-in">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp;