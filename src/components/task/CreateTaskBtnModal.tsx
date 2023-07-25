import { IoMdAdd } from "react-icons/io";
import CreateTaskForm from "./CreateTaskForm";
import Modal from "../ui/Modal";

interface CreateTaskBtnModal {
    listId: string,
}
const CreateTaskBtnModal = ({ listId }: CreateTaskBtnModal) => {
    return (
        <>
            {/* BTN */}
            <label htmlFor={listId} className="btn bg-base-300 normal-case w-full border-none flex justify-start hover:bg-base-200 transition-all">
                <IoMdAdd className="text-base-content text-xl" /> Add new task
            </label>

            {/* MODAL */}
            <Modal 
                id={listId}
                body={<CreateTaskForm listId={listId} />}
            />
        </>
    )
}

export default CreateTaskBtnModal;