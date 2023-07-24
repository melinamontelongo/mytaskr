import Link from "next/link"
import { BsPersonWorkspace } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { RiTableFill } from "react-icons/ri";
import Dropdown from "./ui/Dropdown";

const CreateDropdown = () => {
    return (
        <Dropdown 
        isPrimary={true}
        isLabelStyled={true}
        label={<><IoMdAdd className="text-xl" /> Create</>}
        items={[
            <><Link href="/w/create"><BsPersonWorkspace /> Workspace</Link></>,
            <><Link href="/b/create"><RiTableFill /> Board</Link></>,
        ]}
        />
    )
}

export default CreateDropdown;