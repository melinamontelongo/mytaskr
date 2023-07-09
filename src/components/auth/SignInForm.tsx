"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { UserCredentials, UserCredentialsType } from "@/lib/validators";
import { useRouter } from "next/navigation";

const AuthForm = () => {
    const router = useRouter()
    //  Loading states (Either Google or credentials)
    const [isGLoading, setIsGLoading] = useState<boolean>(false);
    const [isCLoading, setIsCLoading] = useState<boolean>(false);
    //  Form handling
    const { register, handleSubmit, formState: { errors } } = useForm<UserCredentialsType>({
        resolver: zodResolver(UserCredentials)
    });
    //  Sign in with Google next-auth provider
    const loginWithGoogle = async () => {
        setIsGLoading(true);
        try {
            await signIn("google");
            toast.success("Successfully logged in!");
        } catch (e) {
            toast.error("There was an error signing up with Google, please try again later.");
        }
        finally {
            setIsGLoading(false);
        };
    };
    //  Sign in with Credentials next-auth provider
    const loginWithCredentials = async (credentials: FieldValues) => {
        setIsCLoading(true);
        //  Next auth manages sign in (no redirect on error)
        const res = await signIn("credentials", { ...credentials, redirect: false, callbackUrl: `${window.location.origin}/` });
        //  If url is null there was an error
        if (!res?.url) {
            setIsCLoading(false);
            toast.error(res?.error || "Invalid email or password")
            //  No error
        } else {
            toast.success("Successfully logged in!");
            //  Refresh so that user gets redirected to home as specified on Sign In Page
            router.refresh()
        }
    };

    return (
        <div className="flex flex-col justify-center w-64 mx-auto">
            <form onSubmit={handleSubmit(loginWithCredentials)}>
                <div className="form-control mb-2">
                    <label className="label">Email</label>
                    <input type="text" className={`input input-bordered ${errors.email ? "border-error" : "border-base-300"}`} {...register("email")} />
                    {errors.email && <p className="text-error text-xs">A valid email address is required.</p>}
                </div>
                <div className="form-control mb-2">
                    <label className="label">Password</label>
                    <input type="password" className={`input input-bordered ${errors.password ? "border-error" : "border-base-300"}`} {...register("password")} />
                    {errors.password && <p className="text-error text-xs">Password must contain between 6 and 18 characters.</p>}
                </div>
                <button className="btn btn-primary normal-case w-full flex mx-auto justify-center items-center gap-4 my-5">
                    {isCLoading ? <span className="loading loading-spinner"></span> : "Sign in"}
                </button>
            </form>

            <div className="divider mt-1">Or continue with</div>

            <button onClick={loginWithGoogle} className="btn bg-base-300 normal-case w-full flex mx-auto justify-center items-center gap-2 mb-2">
                {isGLoading ? <span className="loading loading-spinner"></span> : <><FcGoogle className="text-lg" /> Google</>}
            </button>
        </div>
    )
}

export default AuthForm;