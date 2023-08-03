"use client"
import { BoardCreationForm, BoardCreationFormType, BoardUpdateType, UnsplashPhotoType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import BoardChooseImage from "./BoardChooseImage";

interface BoardSettingsModalProps {
    boardId: string,
    boardName: string,
    boardDescription?: string | null,
    boardImages?: {backgroundImageFull: string | null, backgroundImageSmall: string | null},
}

const BoardSettingsModal = ({ boardId, boardName, boardDescription, boardImages }: BoardSettingsModalProps) => {
    const router = useRouter();
    const [chosenImage, setChosenImage] = useState<UnsplashPhotoType>();

    const boardModal = useRef<HTMLInputElement>(null);
    const { handleSubmit, register, formState: { errors } } = useForm<BoardCreationFormType>({
        resolver: zodResolver(BoardCreationForm),
        defaultValues: {
            name: boardName,
            description: boardDescription ?? "",
        }
    });
    const { mutate: updateBoard, isLoading: isUpdateLoading } = useMutation({
        mutationFn: async ({ name, description, boardId, backgroundImageFull, backgroundImageSmall }: BoardUpdateType) => {
            const payload: BoardUpdateType = { name, description, boardId, backgroundImageFull, backgroundImageSmall }
            const { data } = await axios.put(`/api/b/update/`, payload);
            return data;
        },
        onError: (err) => {
            return toast.error("Could not update board.");
        },
        onSuccess: () => {
            toast.success("Board updated successfully!");
        },
        onSettled: () => {
            //  Close modal
            if (boardModal?.current) boardModal.current.click();
            router.refresh();
        }
    });

    const { mutate: deleteBoard, isLoading: isDeleteLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/b/delete/?id=${boardId}`);
            return data;
        },
        onError: (err) => {
            console.log(err)
            if (err instanceof AxiosError) {
                if (err?.response?.status === 403) return toast.error("Only the author of the workspace can delete its boards.");
                if (err?.response?.status === 401) return toast.error("You must be logged in.");
            }
            toast.error("Could not delete board.");
        },
        onSuccess: () => {
            toast.success("Board deleted successfully!");
            router.push("/");
        },
        onSettled: () => {
            if (boardModal?.current) boardModal.current.click();
        }
    });

    return (
        <Modal
            ref={boardModal}
            id={"boardSettings"}
            body={<>
                <>
                    <form onSubmit={handleSubmit((e) => {
                        const values:BoardUpdateType = {
                            ...e, 
                            boardId, 
                            backgroundImageFull: chosenImage?.urls.full ?? boardImages?.backgroundImageFull ?? undefined,
                            backgroundImageSmall: chosenImage?.urls.small ?? boardImages?.backgroundImageSmall ?? undefined
                        }
                        updateBoard({ ...values })}
                        )}>
                        <div className="text-center">
                            <h3 className="font-bold text-2xl" id="modalTitle">Board Settings</h3>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                            <div className="flex flex-col gap-5 w-full">
                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Name</label>
                                    <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                                    {errors.name && <p className="text-error text-xs my-2">The name of the board is required.</p>}
                                    <label className="label">
                                        <span className="label-text-alt">This is the name of your board.</span>
                                    </label>
                                </div>

                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Description</label>
                                    <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`}  {...register("description")} />
                                    {errors.description && <p className="text-error text-xs my-2">Invalid description</p>}
                                    <label className="label">
                                        <span className="label-text-alt">Describe the purpose of this board.</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="label font-bold text-lg">Change background image</label>
                                    <BoardChooseImage selectImageAction={setChosenImage} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-action justify-center">
                            <button type="button" className="btn btn-outline btn-error rounded normal-case" onClick={() => deleteBoard()}>
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
                            <label htmlFor={`boardSettings`} className="btn bg-base-300 rounded normal-case">Cancel</label>
                        </div>
                    </form>

                </>
            </>}
        />
    )
}

export default BoardSettingsModal;