import CreateListForm from "./CreateListForm";

interface CreateListBtnModalProps {
    boardId: string,
}

const CreateListBtnModal = ({ boardId }: CreateListBtnModalProps) => {
    return (<>
        {/* BTN */}
        <label htmlFor="addUsersModal" className="btn bg-base-300 normal-case w-full">Add list</label>

        {/* MODAL */}
        <input type="checkbox" id="addUsersModal" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                <label htmlFor="addUsersModal" aria-label="close" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</label>
                {/* CREATE LIST FORM */}
                <CreateListForm boardId={boardId} />
            </div>
        </div>
    </>
    )
}

export default CreateListBtnModal;