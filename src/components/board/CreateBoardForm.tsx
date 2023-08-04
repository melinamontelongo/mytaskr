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
import BoardImageBtnModal from "./BoardImageBtnModal";
import Image from "next/image";

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
    const [chosenImage, setChosenImage] = useState<any>();

    useEffect(() => {
        if (!workspaces?.length && !createdWorkspaces?.length) {
            toast.error(<div className="flex items-center gap-2">You have no workspaces. <Link className="btn btn-primary" href="/w/create">Create</Link></div>);
        };
    }, [workspaces, createdWorkspaces]);

    const { mutate: createBoard, isLoading } = useMutation({
        mutationFn: async ({ name, description, workspaceId, backgroundImageFull, backgroundImageSmall }: BoardCreationType) => {
            const payload: BoardCreationType = { name, description, workspaceId, backgroundImageFull, backgroundImageSmall };
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
            <form onSubmit={handleSubmit((e) => createBoard({
                ...e,
                backgroundImageFull: chosenImage?.urls.full ?? undefined,
                backgroundImageSmall: chosenImage?.urls.small ?? undefined
            }))}
            >
                <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Name</label>
                            <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                            {errors.name && <p className="text-error text-xs my-2">{errors.name.message ?? "Invalid board name"}</p>}
                            <label className="label">
                                <span className="label-text-alt">This is the name of your new board.</span>
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Description</label>
                            <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`} {...register("description")} />
                            {errors.description && <p className="text-error text-xs my-2">{errors.description.message ?? "Invalid description"}</p>}
                            <label className="label">
                                <span className="label-text-alt">Describe the purpose of this board.</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Workspace</label>
                            <select
                                className="select select-bordered w-full max-w-xs rounded"
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
                            {errors.workspaceId && <p className="text-error text-xs my-2">Please select a workspace.</p>}
                            <label className="label">
                                <span className="label-text-alt">This is where your board will belong to.</span>
                            </label>
                        </div>
                        <div className="mb-2">
                            <BoardImageBtnModal selectImageAction={setChosenImage} />
                            {chosenImage && <>
                                <div className="flex flex-col justify-center my-2 w-full">
                                    <div className="my-2 flex justify-center">
                                        <Image src={chosenImage?.urls.small} alt={chosenImage?.alt_description} style={{ objectFit: "cover" }} width={200} height={200} />
                                    </div>
                                    <p className="text-sm text-center">Photo by { }
                                        <a href={`https://unsplash.com/@${chosenImage?.user.username}?utm_source=mytaskr&utm_medium=referral`} target="_blank" className="font-bold underline">
                                            {chosenImage?.user.username}
                                        </a>
                                        { } on { }
                                        <a href="https://unsplash.com/?utm_source=mytaskr&utm_medium=referral" className="font-bold underline" target="_blank">
                                            Unsplash
                                        </a>
                                    </p>
                                </div>
                            </>
                            }
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary text-lg normal-case w-full mx-auto rounded" disabled={!workspaces?.length && !createdWorkspaces?.length}>
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