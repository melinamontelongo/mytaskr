import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskBtnModal {
    listId: string,
}
const CreateTaskBtnModal = ({listId}:CreateTaskBtnModal) => {
    return (
        <>
            {/* BTN */}
            <label htmlFor={listId} className="btn bg-base-300 normal-case w-full">Add new task</label>

            {/* MODAL */}
            <input type="checkbox" id={listId} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor={listId} aria-label="close" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</label>
                    {/* CREATE LIST FORM */}
                    <CreateTaskForm listId={listId}/>
                </div>
            </div>
        </>
    )
}

export default CreateTaskBtnModal;