"use client"
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

export default function ThemeToggler() {
    const [mounted, setMounted] = useState<boolean>(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <>
            <button className={`btn btn-ghost ${resolvedTheme === "dark" && "hidden"}`} onClick={() => setTheme('dark')}><BsFillSunFill /></button>
            <button className={`btn btn-ghost ${resolvedTheme === "light" && "hidden"}`} onClick={() => setTheme('light')}><BsFillMoonFill /></button>
        </>
    )
}