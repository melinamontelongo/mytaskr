"use client"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";

interface DeleteListModalProps {
    listId: string,
    listName: string,

}
const DeleteListModal = ({ listId, listName }: DeleteListModalProps) => {
    const router = useRouter();

    const deleteModal = useRef<HTMLInputElement>(null);

    const { mutate: deleteList, isLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/b/update/list/?id=${listId}`);
            return data;
        },
        onError: (err) => {
            toast.error("Could not delete list.");
        },
        onSuccess: () => {
            toast.success("List deleted successfully!");
        },
        onSettled: () => {
            //  Close modal
            if (deleteModal?.current) deleteModal.current.click();
            router.refresh();
        }
    })
    return (
        <>
            <Modal
                ref={deleteModal}
                id={"deleteListModal"}
                body={<>
                    <h3 className="font-bold text-2xl text-center" id="modalTitle">Delete "{listName}" List?</h3>
                    <p>This list and its tasks will be deleted. This cannot be undone.</p>
                </>}
                actionContent={<>
                    <button className="btn btn-primary rounded normal-case" onClick={() => deleteList()}>
                        {isLoading ? <span className="loading loading-spinner"></span>
                            :
                            "Delete"
                        }
                    </button>
                    <label htmlFor={`deleteListModal`} className="btn rounded normal-case">Cancel</label>
                </>}
            />
        </>
    )
}

export default DeleteListModal;