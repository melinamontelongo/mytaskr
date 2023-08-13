"use client"
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import Footer from "./Footer";

const Container = ({ children }: { children: ReactNode }) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={`pt-24 flex flex-col gap-10 bg-center bg-no-repeat bg-fixed bg-cover 
        ${mounted ?
                resolvedTheme === "dark" ? "md:bg-[url('/background_dark_lg.png')] bg-[url('/background_dark_sm.png')] "
                    : "md:bg-[url('/background_light_lg.png')] bg-[url('/background_light_sm.png')]" : ""}`}>
            {children}
            <Footer />
        </div>
    )
}

export default Container;