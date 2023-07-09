"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCredentials, UserCredentialsType } from "@/lib/validators";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

const AuthForm = () => {

    //  Loading states (Either Google or credentials)
    const [isGLoading, setIsGLoading] = useState<boolean>(false);
    const [isCLoading, setIsCLoading] = useState<boolean>(false);
    //  Form handling
    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserCredentialsType>({
        resolver: zodResolver(UserCredentials)
    });
    //  Sign up/in with Google next-auth provider
    const SignUpWithGoogle = async () => {
        setIsGLoading(true);
        try {
            await signIn("google");
            toast.success("Success!");
        } catch (e) {
            toast.error("There was an error signing up with Google, please try again later.");
        }
        finally {
            setIsGLoading(false);
        };
    };
    //  Custom sign up to register credentials on db
    const signUpWithCredentials = async (credentials: FieldValues) => {
        const { email, password } = credentials;
        setIsCLoading(true);
        try {
            await axios.post("/api/auth/sign-up", { email, password });
            toast.success(<div className="flex items-center gap-2">Successfully registered! <Link className="btn btn-primary" href="/sign-in">sign in</Link></div>);
            reset();
        } catch (e: any) {
            toast.error(e.response.data || "There was an error signing up.");
        } finally {
            setIsCLoading(false);
        };
    };

    return (
        <div className="flex flex-col justify-center w-64 mx-auto">
            <form onSubmit={handleSubmit(signUpWithCredentials)}>
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
                    {isCLoading ? <span className="loading loading-spinner"></span> : "Sign up"}
                </button>
            </form>

            <div className="divider mt-1">Or continue with</div>

            <button onClick={SignUpWithGoogle} className="btn bg-base-300 normal-case w-full flex mx-auto justify-center items-center gap-4 mb-2">
                {isGLoading ? <span className="loading loading-spinner"></span> : <><FcGoogle /> Google</>}
            </button>
        </div>
    )
}

export default AuthForm;