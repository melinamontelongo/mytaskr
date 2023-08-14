import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="footer items-center justify-center md:justify-between p-4 bg-base-300">
            <div className="items-center grid-flow-col">
                <p>Copyright © 2023 - All rights reserved</p>
            </div>
            <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end justify-self-center">
                <Link href="https://github.com/melinamontelongo/mytaskr" target="_blank" aria-label="Github repo"><BsGithub className="w-6 h-6" /></Link>
                <Link href="https://www.linkedin.com/in/melina-montelongo/" target="_blank" aria-label="Creator's linkedin"><BsLinkedin className="w-6 h-6" /></Link>
            </div>
        </footer>
    )
}

export default Footer;