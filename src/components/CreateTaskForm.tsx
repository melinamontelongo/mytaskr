"use client"

import { TaskCreationForm, TaskCreationFormType, TaskCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface CreateListFormProps {
    listId: string,
}

const CreateTaskForm = ({ listId }: CreateListFormProps) => {
    const router = useRouter();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<TaskCreationFormType>({
        resolver: zodResolver(TaskCreationForm)
    })
    const { mutate: createList, isLoading } = useMutation({
        mutationFn: async ({ name, description, listId }: TaskCreationType) => {
            const payload: TaskCreationType = { name, description, listId }
            const { data } = await axios.post("/api/b/create/task", payload)
            return data;
        },//   TODO: TOASTS
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            console.log("success")
            reset()
            router.refresh()
        }
    })
    return (
        <div className="mx-auto">
            <form onSubmit={handleSubmit((e) => createList({ ...e, listId }))}>
                <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Name</label>
                            <input type="text" className="input input-bordered" {...register("name")} />
                            {errors.name && <p className="text-error text-sm">Invalid list name</p>}
                            <label className="label">
                                <span className="label-text-alt">This is the name of the new task.</span>
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Description</label>
                            <textarea className="textarea textarea-bordered"  {...register("description")} />
                            {errors.name && <p className="text-error text-sm">Invalid description</p>}
                            <label className="label">
                                <span className="label-text-alt">Describe this task.</span>
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mx-auto">
                    {isLoading ? <span className="loading loading-spinner"></span>
                        :
                        "Create task"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateTaskForm;