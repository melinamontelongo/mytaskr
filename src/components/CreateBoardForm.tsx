"use client"
import { BoardCreation, BoardCreationForm, BoardCreationFormType, BoardCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workspace } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CreateBoardFormProps {
    workspaces?: Workspace[],
    createdWorkspaces?: Workspace[],
}

const CreateBoardForm = ({ workspaces, createdWorkspaces }: CreateBoardFormProps) => {
    const router = useRouter();
    const [selectedWorkspaceID, setSelectedWorkspaceID] = useState<string>("")
    const { handleSubmit, register, formState: { errors } } = useForm<BoardCreationType>({
        resolver: zodResolver(BoardCreation)
    });

    const { mutate: createBoard, isLoading } = useMutation({
        mutationFn: async ({ name, description, workspaceId }: BoardCreationType) => {
            const payload: BoardCreationType = { name, description, workspaceId };
            const { data } = await axios.post("/api/b/create", payload)
            return data;
        },
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            console.log("success")
            router.push(`/w/${selectedWorkspaceID}`)
            router.refresh()
        }
    })

    return (
        <div className="mx-auto">
            <form onSubmit={handleSubmit((e) => createBoard(e))}>
                <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Name</label>
                            <input type="text" className="input input-bordered" {...register("name")} />
                            {errors.name && <p className="text-error text-sm">Invalid workspace name</p>}
                            <label className="label">
                                <span className="label-text-alt">This is the name of your new board.</span>
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Description</label>
                            <textarea className="textarea textarea-bordered"  {...register("description")} />
                            {errors.name && <p className="text-error text-sm">Invalid description</p>}
                            <label className="label">
                                <span className="label-text-alt">Describe the purpose of this board.</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Workspace</label>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                {...register("workspaceId")}
                                onChange={(e) => setSelectedWorkspaceID(e.target.value)}
                            >
                                <option disabled value="">Select a workspace</option>
                                {workspaces && workspaces?.map((w) => {
                                    return <option value={w.id} key={w.id}>{w.name}</option>
                                })}
                                {createdWorkspaces && createdWorkspaces?.map((w) => {
                                    return <option value={w.id} key={w.id}>{w.name}</option>
                                })}
                            </select>
                            {errors.workspaceId && <p className="text-error text-sm">Please select a workspace.</p>}
                            <label className="label">
                                <span className="label-text-alt">This is where your board will belong to.</span>
                            </label>
                        </div>

                    </div>


                </div>
                <button type="submit" className="btn btn-primary w-full mx-auto">
                    {isLoading ? <span className="loading loading-spinner"></span>
                        :
                        "Create new workspace"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateBoardForm;