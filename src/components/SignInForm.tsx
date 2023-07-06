"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FiLoader } from "react-icons/fi";
import {zodResolver} from "@hookform/resolvers/zod";
import { UserCredentials } from "@/lib/validators";

const AuthForm = () => {

    const [isGLoading, setIsGLoading] = useState<boolean>(false);
    const [isCLoading, setIsCLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(UserCredentials)
    });

    const loginWithGoogle = async () => {
        setIsGLoading(true);
        try {
            await signIn("google");
        } catch (e) {
            console.error(e)
        }
        finally {
            setIsGLoading(false);
        }
    }

    const loginWithCredentials = async (credentials: FieldValues) => {
        setIsCLoading(true);
        try {
            await signIn("credentials", credentials);
        } catch (e) {
            console.error(e)
        } finally {
            setIsCLoading(true);
        }
    }
console.log(errors)
    return (
        <div className="flex flex-col justify-center">
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
                    {isCLoading ? <FiLoader /> : null}
                    Sign in
                </button>
            </form>

            <div className="divider">Or continue with</div>

            <button onClick={loginWithGoogle} className="btn normal-case w-full flex mx-auto justify-center items-center gap-4 mb-2">
                {isGLoading ? <FiLoader /> : <FcGoogle />}
                Google
            </button>
        </div>
    )
}

export default AuthForm;