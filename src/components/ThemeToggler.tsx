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
            <button
                aria-label="change theme to dark"
                className={`btn btn-ghost normal-case rounded ${resolvedTheme === "dark" && "hidden"}`}
                onClick={() => setTheme('dark')}><BsFillSunFill /> <span className="md:hidden">Change theme</span>
            </button>
            <button
                aria-label="change theme to light"
                className={`btn btn-ghost normal-case rounded ${resolvedTheme === "light" && "hidden"}`}
                onClick={() => setTheme('light')}>
                <BsFillMoonFill /> <span className="md:hidden">Change theme</span>
            </button>
        </>
    )
}