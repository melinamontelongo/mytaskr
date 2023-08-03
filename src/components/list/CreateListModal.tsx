import Modal from "../ui/Modal";
import CreateListForm from "./CreateListForm";

interface CreateListModalProps {
    boardId: string,
}

const CreateListModal = ({ boardId }: CreateListModalProps) => {
    return (
        <Modal
            id={"createListModal"}
            body={<CreateListForm boardId={boardId} />}
        />
    )
}

export default CreateListModal;