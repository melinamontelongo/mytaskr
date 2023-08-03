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
            <div className={`card w-80 min-h-40 bg-base-100 shadow-md hover:shadow-xl hover:scale-105 transition-transform ${backgroundImageSrc && "image-full"}`}>
                {backgroundImageSrc &&  <figure><Image src={backgroundImageSrc} alt={`${title} board background image`}  style={{ objectFit: "cover" }} className="rounded" fill={true}/></figure>}
                <div className="card-body break-words">
                    <h2 className="card-title">{title}</h2>
                    {text && <p>{text}</p>}
                </div>
            </div>
        </Link>
    )
}

export default DisplayCard;