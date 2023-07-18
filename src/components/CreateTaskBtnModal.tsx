import {IoMdAdd} from "react-icons/io";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskBtnModal {
    listId: string,
}
const CreateTaskBtnModal = ({listId}:CreateTaskBtnModal) => {
    return (
        <>
            {/* BTN */}
            <label htmlFor={listId} className="btn bg-base-300 normal-case w-full border-none flex justify-start hover:bg-base-200 transition-all"><IoMdAdd className="text-base-content text-xl"/> Add new task</label>

            {/* MODAL */}
            <input type="checkbox" id={listId} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-base-200">
                    <label htmlFor={listId} aria-label="close" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</label>
                    {/* CREATE LIST FORM */}
                    <CreateTaskForm listId={listId}/>
                </div>
            </div>
        </>
    )
}

export default CreateTaskBtnModal;