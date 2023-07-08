import Link from "next/link"

const CreateDropdown = () => {
    return (
        <details className="dropdown">
            <summary className="m-1 btn btn-primary normal-case">Create</summary>
            <ul className="p-2 shadow-md menu dropdown-content z-[1] bg-base-100 border border-base-200 rounded-box w-52">
                <li><Link href="/w/create">Workspace</Link></li>
                <li><Link href="/b/create">Board</Link></li>
            </ul>
        </details>
    )
}

export default CreateDropdown;