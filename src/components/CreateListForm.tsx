"use client"

import { ListCreationForm, ListCreationFormType, ListCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface CreateListFormProps {
    boardId: string,
}

const CreateListForm = ({ boardId }: CreateListFormProps) => {
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
            return toast.error("Could not create list.")
        },
        onSuccess: () => {
            toast.success("List created successfully!")
            reset();
            //  Close modal
            const checkModal = document.getElementById("createListModal");
            checkModal?.click();
            router.refresh();
        }
    });
    return (
        <div className="mx-auto">
            <form onSubmit={handleSubmit((e) => createList({ ...e, boardId }))}>
                <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Name</label>
                            <input type="text" className="input input-bordered" {...register("name")} />
                            {errors.name && <p className="text-error text-sm">Invalid list name</p>}
                            <label className="label">
                                <span className="label-text-alt">This is the name of your new list.</span>
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Description</label>
                            <textarea className="textarea textarea-bordered"  {...register("description")} />
                            {errors.name && <p className="text-error text-sm">Invalid description</p>}
                            <label className="label">
                                <span className="label-text-alt">Describe the purpose of this list.</span>
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mx-auto">
                    {isLoading ? <span className="loading loading-spinner"></span>
                        :
                        "Create list"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateListForm;