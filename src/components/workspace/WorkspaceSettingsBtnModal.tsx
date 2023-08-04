"use client"
import { AiOutlineSetting } from "react-icons/ai";
import Modal from "../ui/Modal";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { WorkspaceCreationForm, WorkspaceCreationFormType, WorkspaceUpdateType } from "@/lib/validators";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface WorkspaceSettingsBtnModalProps {
    workspaceId: string,
    workspaceName: string,
    workspaceDescription?: string | null,
    isPublic: boolean,
    isMember: boolean,
}
const WorkspaceSettingsBtnModal = ({ workspaceId, workspaceName, workspaceDescription, isPublic, isMember }: WorkspaceSettingsBtnModalProps) => {
    const router = useRouter();
    const settingsModal = useRef<HTMLInputElement>(null);
    const [isPublicChecked, setIsPublicChecked] = useState<boolean>(isPublic);

    const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceCreationFormType>({
        resolver: zodResolver(WorkspaceCreationForm),
        defaultValues: {
            name: workspaceName,
            description: workspaceDescription ?? "",
            visibility: isPublic ? "public" : "private",
        }
    });
    const { mutate: updateWorkspace, isLoading: isUpdateLoading } = useMutation({
        mutationFn: async ({ name, description, visibility, workspaceId }: WorkspaceUpdateType) => {
            const payload: WorkspaceUpdateType = { name, description, visibility, workspaceId }
            const { data } = await axios.put(`/api/w/update/`, payload);
            return data;
        },
        onError: (err) => {
            return toast.error("Could not update workspace.");
        },
        onSuccess: () => {
            toast.success("Workspace updated successfully!");
        },
        onSettled: () => {
            //  Close modal
            if (settingsModal?.current) settingsModal.current.click();
            router.refresh();
        }
    })
    const { mutate: deleteWorkspace, isLoading: isDeleteLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/w/delete/?id=${workspaceId}`);
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) return toast.error("Only the author can delete the workspace.")
            toast.error("Could not delete workspace.");
        },
        onSuccess: () => {
            toast.success("Workspace deleted successfully!");
            router.push("/");
        },
        onSettled: () => {
            if (settingsModal?.current) settingsModal.current.click();
        }
    })

    return (
        <>
            <label htmlFor={"workspaceSettings"} className="btn bg-base-300 normal-case w-full border-none flex items-center justify-center rounded">
                <AiOutlineSetting className="text-base-content text-xl" /> Settings
            </label>

            <Modal
                ref={settingsModal}
                id={"workspaceSettings"}
                body={<>
                    <>
                        <form onSubmit={handleSubmit((e) => updateWorkspace({ ...e, workspaceId }))}>
                            <div className="text-center">
                                <h3 className="font-bold text-2xl" id="modalTitle">Workspace Settings</h3>
                                {!isMember && <p className="text-xs text-error">Only members can edit or delete this workspace.</p>}
                            </div>
                            <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                                <div className="flex flex-col gap-5 w-full">
                                    <div className="form-control mb-2">
                                        <label className="label font-bold text-lg">Name</label>
                                        <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} disabled={!isMember} />
                                        {errors.name && <p className="text-error text-xs my-2">{errors.name.message ?? "The name of the workspace is required."}</p>}
                                        <label className="label">
                                            <span className="label-text-alt">This is the name of this workspace.</span>
                                        </label>
                                    </div>

                                    <div className="form-control mb-2">
                                        <label className="label font-bold text-lg">Description</label>
                                        <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`}  {...register("description")} disabled={!isMember} />
                                        {errors.description && <p className="text-error text-xs my-2">{errors.description.message ?? "Invalid description"}</p>}
                                        <label className="label">
                                            <span className="label-text-alt">Describe the purpose of this workspace.</span>
                                        </label>
                                    </div>

                                    <fieldset>
                                        <legend className="font-bold text-lg">Visibility</legend>
                                        <div className="form-control mb-2">
                                            <label className="label cursor-pointer">
                                                <span className="label-text">Public</span>
                                                <input id="visibility-public" type="radio" value="public" className="radio checked:bg-primary" disabled={!isMember}
                                                    {...register("visibility")}
                                                    onClick={(e: any) => setIsPublicChecked(e.target.value === "public")} />
                                            </label>
                                        </div>
                                        <div className="form-control mb-2">
                                            <label className="label cursor-pointer">
                                                <span className="label-text">Private</span>
                                                <input id="visibility-private" type="radio" value="private" className="radio checked:bg-primary" disabled={!isMember}
                                                    {...register("visibility")}
                                                    onClick={(e: any) => setIsPublicChecked(e.target.value === "public")} />
                                            </label>
                                        </div>
                                        {errors.visibility && <p className="text-error text-sm">Please select an option.</p>}
                                        <label className="label">
                                            {isPublicChecked ?
                                                <span className="label-text-alt">Public workspaces can be seen by other users but only invited members can edit it.</span>
                                                :
                                                <span className="label-text-alt">Private workspaces can only be seen and edited by you and invited members.</span>
                                            }
                                        </label>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn btn-outline btn-error rounded normal-case" onClick={() => deleteWorkspace()} disabled={!isMember}>
                                    {isDeleteLoading ? <span className="loading loading-spinner"></span>
                                        :
                                        "Delete"
                                    }
                                </button>
                                <button type="submit" className="btn btn-primary rounded normal-case" disabled={!isMember}>
                                    {isUpdateLoading ? <span className="loading loading-spinner"></span>
                                        :
                                        "Save"
                                    }
                                </button>
                                <label htmlFor={`workspaceSettings`} className="btn bg-base-300 rounded normal-case">Cancel</label>
                            </div>
                        </form>
                    </>
                </>}
            />
        </>
    )
}

export default WorkspaceSettingsBtnModal;