"use client"
import axios from "axios";
import { BoardCreation, BoardCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workspace } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface CreateBoardFormProps {
    workspaces?: Workspace[],
    createdWorkspaces?: Workspace[],
};

const CreateBoardForm = ({ workspaces, createdWorkspaces }: CreateBoardFormProps) => {
    const router = useRouter();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<BoardCreationType>({
        resolver: zodResolver(BoardCreation)
    });
    const [selectedWorkspaceID, setSelectedWorkspaceID] = useState<string>("");
    
    useEffect(() => {
        if(!workspaces?.length && !createdWorkspaces?.length){
            toast.error(<div className="flex items-center gap-2">You have no workspaces. <Link className="btn btn-primary" href="/w/create">Create</Link></div>);
        };
    }, [workspaces, createdWorkspaces]);

    const { mutate: createBoard, isLoading } = useMutation({
        mutationFn: async ({ name, description, workspaceId }: BoardCreationType) => {
            const payload: BoardCreationType = { name, description, workspaceId };
            setSelectedWorkspaceID(workspaceId);
            const { data } = await axios.post("/api/b/create", payload);
            return data;
        },
        onError: (err) => {
            return toast.error("Could not create board.");
        },
        onSuccess: () => {
            toast.success("Board created successfully!");
            reset();
            router.push(`/w/${selectedWorkspaceID}`);
            router.refresh();
        },
    });

    return (
        <div className="mx-auto">
            <form onSubmit={handleSubmit((e) => createBoard(e))}>
                <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Name</label>
                            <input type="text" className="input input-bordered" {...register("name")} />
                            {errors.name && <p className="text-error text-sm">Invalid board name</p>}
                            <label className="label">
                                <span className="label-text-alt">This is the name of your new board.</span>
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Description</label>
                            <textarea className="textarea textarea-bordered"  {...register("description")} />
                            {errors.description && <p className="text-error text-sm">Invalid description</p>}
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
                            >
                                {!workspaces?.length && !createdWorkspaces?.length ?
                                    <option disabled value="" defaultValue="">You have no workspaces.</option>
                                    :
                                    <option disabled value="" defaultValue="">Select a workspace</option>
                                }
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
                <button type="submit" className="btn btn-primary w-full mx-auto" disabled={!workspaces?.length && !createdWorkspaces?.length}>
                    {isLoading ? <span className="loading loading-spinner"></span>
                        :
                        "Create new board"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateBoardForm;