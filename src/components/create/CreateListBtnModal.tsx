import { IoMdAdd } from "react-icons/io";
import CreateListForm from "./CreateListForm";
import Modal from "../ui/Modal";

interface CreateListBtnModalProps {
    boardId: string,
}

const CreateListBtnModal = ({ boardId }: CreateListBtnModalProps) => {
    return (<>
        {/* BTN */}
        <label htmlFor="createListModal" className="btn bg-base-300 normal-case w-fit rounded">
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