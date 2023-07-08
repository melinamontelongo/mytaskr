"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { UserCredentials, UserCredentialsType } from "@/lib/validators";

const AuthForm = () => {

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
        try {
            await signIn("credentials", credentials);
            toast.success("Successfully logged in!");
        } catch (e: any) {
            toast.error(e.response.data || "There was an error signing up.");
        } finally {
            setIsCLoading(true);
        };
    };

    return (
        <div className="flex flex-col justify-center w-64 mx-auto">
            <form onSubmit={handleSubmit(loginWithCredentials)}>
                <div className="form-control mb-2">
                    <label className="label">Email</label>
                    <input type="text" className="input input-bordered" {...register("email")} />
                    {errors.email && <p className="text-error">Invalid email address</p>}
                </div>
                <div className="form-control mb-2">
                    <label className="label">Password</label>
                    <input type="password" className="input input-bordered" {...register("password")} />
                    {errors.password && <p className="text-error">Invalid password</p>}
                </div>
                <button className="btn normal-case w-full flex mx-auto justify-center items-center gap-4 mb-2">
                    {isCLoading ? <span className="loading loading-spinner"></span> : "Sign in"}
                </button>
            </form>

            <div className="divider">Or continue with</div>

            <button onClick={loginWithGoogle} className="btn normal-case w-full flex mx-auto justify-center items-center gap-4 mb-2">
                {isGLoading ? <span className="loading loading-spinner"></span> : <><FcGoogle /> Google</>}
            </button>
        </div>
    )
}

export default AuthForm;