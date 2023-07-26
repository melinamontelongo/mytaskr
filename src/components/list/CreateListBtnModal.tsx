import { IoMdAdd } from "react-icons/io";
import Modal from "../ui/Modal";
import CreateListForm from "./CreateListForm";

interface CreateListBtnModalProps {
    boardId: string,
}

const CreateListBtnModal = ({ boardId }: CreateListBtnModalProps) => {
    return (<>
        {/* BTN */}
        <label htmlFor="createListModal" className="btn bg-base-300 normal-case w-full border-none flex items-center justify-center rounded">
            <IoMdAdd className="text-base-content text-xl" />
            Add list
        </label>

        {/* MODAL */}
        <Modal
            id={"createListModal"}
            body={<CreateListForm boardId={boardId} />}
        />
    </>
    )
}

export default CreateListBtnModal;