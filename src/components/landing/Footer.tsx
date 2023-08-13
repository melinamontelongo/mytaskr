import Image from "next/image";
import icon from "../../../public/icon.png";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="footer footer-center p-8  bg-base-300/50 backdrop-blur-sm text-primary-content">
            <div>
                <Image src={icon} alt="mytaskr logo" width={50} height={50} />
                <p><span className="font-bold">mytaskr</span> by Melina Montelongo.</p>
                <p>Copyright © 2023 - All rights reserved</p>
            </div>
            <div>
                <div className="grid grid-flow-col gap-4">
                    <Link href="https://github.com/melinamontelongo/mytaskr" target="_blank" aria-label="Github repo"><BsGithub className="w-6 h-6" /></Link>
                    <Link href="https://www.linkedin.com/in/melina-montelongo/" target="_blank" aria-label="Creator's linkedin"><BsLinkedin className="w-6 h-6" /></Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer;