import Link from "next/link";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
    return (
        <div className="space-y-5">
            <div>
             {/*    <h2 className="font-extrabold text-2xl text-center">mytaskr</h2> */}
                <h1 className="font-extrabold text-4xl text-center">Sign up</h1>
            </div>
            <div>
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