"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FiLoader } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCredentials } from "@/lib/validators";
import axios from "axios";

const AuthForm = () => {

    const [isGLoading, setIsGLoading] = useState<boolean>(false);
    const [isCLoading, setIsCLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(UserCredentials)
    });

    const SignUpWithGoogle = async () => {
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

    const signUpWithCredentials = async (credentials: FieldValues) => {
        const { email, password } = credentials;
        setIsCLoading(true);
        try {
            await axios.post("/api/auth/sign-up", { email, password });
        } catch (e) {
            console.error(e)
        } finally {
            setIsCLoading(true);
        }
    }

    return (
        <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit(signUpWithCredentials)}>
                <div className="form-control mb-2">
                    <label className="label">Username</label>
                    <input type="text" className="input input-bordered" {...register("email")} />
                    {errors.username && <p className="text-error">Invalid username</p>}
                </div>
                <div className="form-control mb-2">
                    <label className="label">Password</label>
                    <input type="password" className="input input-bordered" {...register("password")} />
                    {errors.password && <p className="text-error">Invalid password</p>}
                </div>
                <button className="btn normal-case w-full flex mx-auto justify-center items-center gap-4 mb-2">
                    {isCLoading ? <FiLoader /> : null}
                    Sign up
                </button>
            </form>

            <div className="divider">Or continue with</div>

            <button onClick={SignUpWithGoogle} className="btn normal-case w-full flex mx-auto justify-center items-center gap-4 mb-2">
                {isGLoading ? <FiLoader /> : <FcGoogle />}
                Google
            </button>
        </div>
    )
}

export default AuthForm;