"use client"
import { signOut } from "next-auth/react";

const SignOutButton = () => {

    const logout = async () => {
        await signOut();
    }

    return <button onClick={logout}>Sign out</button>
};

export default SignOutButton;