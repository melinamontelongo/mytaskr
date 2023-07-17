import Link from "next/link";

interface DisplayCardProps {
    title: string,
    text: string | null | undefined,
    linkHref: string,
}

const DisplayCard = ({ title, text, linkHref }: DisplayCardProps) => {
    return (
        <Link href={linkHref}>
            <div className="card w-80 min-h-40 bg-base-100 shadow-md hover:shadow-xl hover:scale-105 transition-transform">
                <div className="card-body break-words">
                    <h2 className="card-title">{title}</h2>
                    {text && <p>{text}</p>}
                </div>
            </div>
        </Link>
    )
}

export default DisplayCard;