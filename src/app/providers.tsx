"use client"
import { ThemeProvider } from "next-themes";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute="data-theme" value={{dark: "coffee", light: "autumn"}}>
            {children}
        </ThemeProvider>
    )
}

export default Providers;