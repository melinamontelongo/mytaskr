import Link from "next/link"
import { BsPersonWorkspace } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { RiTableFill } from "react-icons/ri";

const CreateDropdown = () => {
    return (
        <div className="dropdown" role="menu">
            <label tabIndex={0} className="m-1 btn btn-primary normal-case rounded"><IoMdAdd className="text-xl" /> Create</label>
            <ul tabIndex={0} className="p-2 shadow-md menu dropdown-content z-[1] bg-base-100 border border-base-200 rounded-box w-52">
                <li role="menuitem"><Link href="/w/create"><BsPersonWorkspace /> Workspace</Link></li>
                <li role="menuitem"><Link href="/b/create"><RiTableFill /> Board</Link></li>
            </ul>
        </div>
    )
}

export default CreateDropdown;