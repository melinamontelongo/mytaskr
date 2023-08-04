"use client"
import { ListCreationForm, ListCreationFormType, ListCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";

interface CreateListModalProps {
    boardId: string,
}

const CreateListModal = ({ boardId }: CreateListModalProps) => {
    const router = useRouter();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<ListCreationFormType>({
        resolver: zodResolver(ListCreationForm)
    });
    const { mutate: createList, isLoading } = useMutation({
        mutationFn: async ({ name, description, boardId }: ListCreationType) => {
            const payload: ListCreationType = { name, description, boardId }
            const { data } = await axios.post("/api/b/create/list", payload)
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response) {
                if (err?.response?.status === 403) {
                    toast.error("Only workspace members can create lists.");
                } else if (err?.response?.status === 401) {
                    toast.error("You must be logged in.");
                }
            } else {
                toast.error("Could not create list.")
            }
        },
        onSuccess: () => {
            toast.success("List created successfully!")
            reset();
            router.refresh();
        },
        onSettled: () => {
            reset();
            //  Close modal
            const checkModal = document.getElementById("createListModal");
            checkModal?.click();
        },
    });
    return (
        <Modal
            id={"createListModal"}
            body={<>
                <h3 className="font-bold text-2xl text-center" id="modalTitle">Create List</h3>
                <div className="mx-auto">
                    <form onSubmit={handleSubmit((e) => createList({ ...e, boardId }))}>
                        <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                            <div className="flex flex-col gap-5 w-full">
                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Name</label>
                                    <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                                    {errors.name && <p className="text-error text-xs my-2">{errors.name.message ?? "The name of the list is required."}</p>}
                                    <label className="label">
                                        <span className="label-text-alt">This is the name of your new list.</span>
                                    </label>
                                </div>

                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Description</label>
                                    <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`}  {...register("description")} />
                                    {errors.description && <p className="text-error text-xs my-2">{errors.description.message ?? "Invalid description."}</p>}
                                    <label className="label">
                                        <span className="label-text-alt">Describe the purpose of this list.</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary normal-case rounded">
                                {isLoading ? <span className="loading loading-spinner"></span>
                                    :
                                    "Create"
                                }
                            </button>
                            <label htmlFor={`createListModal`} className="btn bg-base-300 rounded normal-case">Cancel</label>
                        </div>
                    </form>
                </div>
            </>}
        />
    )
}

export default CreateListModal;