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
            <button aria-label="change theme to dark" className={`btn btn-ghost rounded ${resolvedTheme === "dark" && "hidden"}`} onClick={() => setTheme('dark')}><BsFillSunFill /></button>
            <button aria-label="change theme to light" className={`btn btn-ghost rounded ${resolvedTheme === "light" && "hidden"}`} onClick={() => setTheme('light')}><BsFillMoonFill /></button>
        </>
    )
}