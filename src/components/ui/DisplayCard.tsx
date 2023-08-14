import Image from "next/image";
import Link from "next/link";

interface DisplayCardProps {
    title: string,
    text: string | null | undefined,
    linkHref: string,
    backgroundImageSrc?: string | null,
}

const DisplayCard = ({ title, text, linkHref, backgroundImageSrc }: DisplayCardProps) => {
    return (
        <Link href={linkHref} className="mx-auto md:mx-0">
            <div className={`card w-40 sm:w-60 md:w-80 h-32 bg-base-200 shadow-md hover:shadow-xl hover:scale-105 transition-transform ${backgroundImageSrc && "image-full"}`}>
                {backgroundImageSrc && <figure><Image src={backgroundImageSrc} alt={`${title} board background image`} style={{ objectFit: "cover" }} className="rounded" fill={true} /></figure>}
                <div className="card-body break-all md:break-words w-40 sm:w-62 md:w-80 ">
                    <h2 className="card-title">{title}</h2>
                    {text &&
                        <p className="truncate">{text}</p>
                    }
                </div>
            </div>
        </Link>
    )
}

export default DisplayCard;