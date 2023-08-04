"use client"
import axios, { AxiosError } from "axios";
import { TaskCreationForm, TaskCreationFormType, TaskCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";
import { IoMdAdd } from "react-icons/io";

interface CreateTaskBtnModal {
    listId: string,
}
const CreateTaskBtnModal = ({ listId }: CreateTaskBtnModal) => {
    const router = useRouter();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<TaskCreationFormType>({
        resolver: zodResolver(TaskCreationForm)
    });
    const { mutate: createList, isLoading } = useMutation({
        mutationFn: async ({ name, description, listId }: TaskCreationType) => {
            const payload: TaskCreationType = { name, description, listId };
            const { data } = await axios.post("/api/b/create/task", payload);
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err?.response?.status === 403) {
                    toast.error("Only workspace members can create tasks.");
                } else if (err?.response?.status === 401) {
                    toast.error("You must be logged in.");
                }
            } else {
                toast.error("Could not create task.");
            }
        },
        onSuccess: () => {
            toast.success("Task created successfully!");
            router.refresh();
        },
        onSettled: () => {
            reset();
            //  Close modal
            const checkModal = document.getElementById(listId);
            checkModal?.click()
        }
    });
    return (
        <>
            <label htmlFor={listId} className="btn btn-ghost normal-case w-full border-none flex justify-start transition-all">
                <IoMdAdd className="text-base-content text-xl" /> Add new task
            </label>

            <Modal
                id={listId}
                body={<>
                    <h3 className="font-bold text-2xl text-center" id="modalTitle">Create Task</h3>
                    <div className="mx-auto">
                        <form onSubmit={handleSubmit((e) => createList({ ...e, listId }))}>
                            <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                                <div className="flex flex-col gap-5 w-full">
                                    <div className="form-control mb-2">
                                        <label className="label font-bold text-lg">Name</label>
                                        <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                                        {errors.name && <p className="text-error text-xs my-2">The name of the task is required.</p>}
                                        <label className="label">
                                            <span className="label-text-alt">This is the name of the new task.</span>
                                        </label>
                                    </div>

                                    <div className="form-control mb-2">
                                        <label className="label font-bold text-lg">Description</label>
                                        <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`}  {...register("description")} />
                                        {errors.description && <p className="text-error text-xs my-2">Invalid description</p>}
                                        <label className="label">
                                            <span className="label-text-alt">Describe this task.</span>
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
                                <label htmlFor={listId} className="btn bg-base-300 rounded normal-case">Cancel</label>
                            </div>
                        </form>
                    </div>
                </>}
            />
        </>
    )
}

export default CreateTaskBtnModal;