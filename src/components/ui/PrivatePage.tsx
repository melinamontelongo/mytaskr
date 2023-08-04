import Link from "next/link";

interface PrivatePageProps {
    page: "workspace" | "board"
}
const PrivatePage = ({ page }: PrivatePageProps) => {
    return (
        <div className="h-screen max-w-2xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
            <h1 className="font-extrabold text-xl">That is a private {page} and you don&apos;t seem to be a member.</h1>
            <Link href="/" className="font-bold text-lg underline text-primary">Check your {page}s.</Link>
        </div>
    )
}

export default PrivatePage;