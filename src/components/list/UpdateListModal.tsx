"use client"
import { ListCreationForm, ListCreationFormType, ListCreationType, ListUpdateType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";

interface UpdateListModalProps {
    listId: string,
    listName: string,
    listDescription?: string | null,
}

const UpdateListModal = ({ listId, listName, listDescription }: UpdateListModalProps) => {
    const router = useRouter();
    const updateModal = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ListCreationFormType>({
        resolver: zodResolver(ListCreationForm),
        defaultValues: {
            name: listName,
            description: listDescription ?? "",
        }
    });

    useEffect(() => {
        reset({name: listName, description: listDescription ?? ""});
    }, [listId, listName, listDescription, reset]);

    const { mutate: updateList, isLoading } = useMutation({
        mutationFn: async ({ name, description, listId }: ListUpdateType) => {
            const payload: ListUpdateType = { name, description, listId }
            const { data } = await axios.put(`/api/b/update/list/`, payload);
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err?.response?.status === 403) {
                    toast.error("Only workspace members can edit lists.");
                } else if (err?.response?.status === 401) {
                    toast.error("You must be logged in.");
                }
            } else {
                toast.error("Could not delete list.");
            }
        },
        onSuccess: () => {
            toast.success("List edited successfully!")
        },
        onSettled: () => {
            reset();
            //  Close modal
            if (updateModal?.current) updateModal.current.click();
            router.refresh()
        }
    });
    return (
        <Modal
            ref={updateModal}
            id={"updateListModal"}
            body={
                <>
                    <h3 className="font-bold text-2xl text-center" id="modalTitle">Edit &quot;{listName}&quot; List</h3>
                    <form onSubmit={handleSubmit((e) => updateList({ ...e, listId }))}>
                        <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                            <div className="flex flex-col gap-5 w-full">
                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Name</label>
                                    <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                                    {errors.name && <p className="text-error text-xs my-2">The name of the list is required.</p>}
                                    <label className="label">
                                        <span className="label-text-alt">This is the name of your list.</span>
                                    </label>
                                </div>

                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Description</label>
                                    <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`}  {...register("description")} />
                                    {errors.description && <p className="text-error text-xs my-2">Invalid description</p>}
                                    <label className="label">
                                        <span className="label-text-alt">Describe the purpose of this list.</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary rounded normal-case">
                                {isLoading ? <span className="loading loading-spinner"></span>
                                    :
                                    "Save"
                                }
                            </button>
                            <label htmlFor={`updateListModal`} className="btn btn-base-300 rounded normal-case">Cancel</label>
                        </div>
                    </form>
                </>
            }
        />
    )
}

export default UpdateListModal;