"use client"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ThemeProvider attribute="data-theme" value={{ dark: "business", light: "corporate" }}>
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default Providers;