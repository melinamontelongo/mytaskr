"use client"

import { TaskCreationForm, TaskCreationFormType, TaskUpdateType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";


interface TaskModalProps {
    task: Task,
    listName: string | undefined,
}
const TaskModal = ({ task, listName }: TaskModalProps) => {
    const router = useRouter();
    const modal = useRef<HTMLInputElement>(null);
    const { handleSubmit, formState: { errors }, register } = useForm<TaskCreationFormType>({
        resolver: zodResolver(TaskCreationForm),
        defaultValues: {
            name: task.name,
            description: task.description ?? "",
        }
    });
    const { mutate: updateTask, isLoading: isUpdateLoading } = useMutation({
        mutationFn: async ({ name, description, taskId }: TaskUpdateType) => {
            const payload: TaskUpdateType = { name, description, taskId }
            const { data } = await axios.put(`/api/b/update/task/`, payload);
            return data;
        },
        onError: (err) => {
            toast.error("Could not edit task.")
        },
        onSuccess: () => {
            toast.success("Task edited successfully!")
        },
        onSettled: () => {
            //  Close modal
            if (modal?.current) modal.current.click();
            router.refresh();
        }
    });
    const { mutate: deleteTask, isLoading: isDeleteLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/b/update/task/?id=${task.id}`);
            return data;
        },
        onError: (err) => {
            toast.error("Could not delete list.")
        },
        onSuccess: () => {
            toast.success("Task deleted successfully!")
        },
        onSettled: () => {
            //  Close modal
            if (modal?.current) modal.current.click();
            router.refresh();
        }
    });
    return (<>
        <input ref={modal} type="checkbox" id={`taskModal`} className="modal-toggle" />
        <div className="modal" aria-modal="true" role="dialog" aria-labelledby="modalTitle">
            <div className="modal-box">
                <label htmlFor={`taskModal`} aria-label="close" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</label>
                <form onSubmit={handleSubmit((e) => updateTask({ ...e, taskId: task.id }))}>
                    <div className="text-center">
                        <h3 className="font-bold text-2xl" id="modalTitle">Edit task</h3>
                        {listName && <p className="text-sm">On list <span className="font-bold">{listName}</span></p>}
                    </div>
                    <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                        <div className="flex flex-col gap-5 w-full">
                            <div className="form-control mb-2">
                                <label className="label font-bold text-lg">Name</label>
                                <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                                {errors.name && <p className="text-error text-xs my-2">The name of the task is required.</p>}
                                <label className="label">
                                    <span className="label-text-alt">This is the name of your task.</span>
                                </label>
                            </div>

                            <div className="form-control mb-2">
                                <label className="label font-bold text-lg">Description</label>
                                <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`}  {...register("description")} />
                                {errors.description && <p className="text-error text-xs my-2">Invalid description</p>}
                                <label className="label">
                                    <span className="label-text-alt">Describe the purpose of this task.</span>
                                </label>
                            </div>

                        </div>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-outline btn-error rounded normal-case" onClick={() => deleteTask()}>
                            {isDeleteLoading ? <span className="loading loading-spinner"></span>
                                :
                                "Delete"
                            }
                        </button>
                        <button type="submit" className="btn btn-primary rounded normal-case">
                            {isUpdateLoading ? <span className="loading loading-spinner"></span>
                                :
                                "Save"
                            }
                        </button>
                        <label htmlFor={`taskModal`} className="btn rounded normal-case">Cancel</label>
                    </div>
                </form>
            </div>
        </div>
    </>)
}

export default TaskModal;