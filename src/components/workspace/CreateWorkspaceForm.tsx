"use client"
import axios from "axios";
import { WorkspaceCreationForm, WorkspaceCreationFormType, WorkspaceCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import InviteBtnModal from "./InviteBtnModal";

const CreateWorkspaceForm = () => {
    const router = useRouter();

    const [isPublicChecked, setIsPublicChecked] = useState<boolean>(true);
    const [invitedUsersIDs, setInvitedUsersIDs] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceCreationFormType>({
        resolver: zodResolver(WorkspaceCreationForm),
        defaultValues: {
            "visibility": "public"
        }
    });

    const { mutate: createWorkspace, isLoading } = useMutation({
        mutationFn: async ({ name, description, visibility, invitedUsers }: WorkspaceCreationType) => {
            const payload: WorkspaceCreationType = { name, description, visibility, invitedUsers }
            const { data } = await axios.post("/api/w/create", payload);
            return data;
        },
        onError: (err) => {
            return toast.error("Could not create workspace.");
        },
        onSuccess: () => {
            toast.success("Workspace created successfully!");
            router.refresh();
            router.push("/");
        },
    });

    const handleData = (values: WorkspaceCreationFormType) => {
        const { name, description, visibility } = values;
        const data = {
            name,
            description,
            visibility,
            invitedUsers: invitedUsersIDs,
        };
        createWorkspace(data);
    };

    const toggleInvitedUsers = (newID: string) => {
        const alreadyExists = invitedUsersIDs?.filter((id) => id === newID);
        // Remove
        if (alreadyExists.length > 0) {
            const newInvitedUsersArr = invitedUsersIDs.filter((id) => id !== newID);
            setInvitedUsersIDs(newInvitedUsersArr);
            return;
        }
        //  Add
        setInvitedUsersIDs((IDs) => [...IDs, newID]);
    };

    return (
        <div className="mx-auto px-5 pb-8">
            <form onSubmit={handleSubmit(handleData)}>
                <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Name</label>
                            <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                            {errors.name && <p className="text-error text-sm">{errors.name.message ?? "Invalid workspace name"}</p>}
                            <label className="label">
                                <span className="label-text-alt">This can be the name of your project, team, organization or company.</span>
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label font-bold text-lg">Description</label>
                            <textarea className={`textarea textarea-bordered rounded ${errors.description && "border-error"}`} {...register("description")} />
                            {errors.description && <p className="text-error text-sm">{errors.description.message ?? "Invalid description"}</p>}
                            <label className="label">
                                <span className="label-text-alt">Describe the purpose of this workspace.</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                        <fieldset>
                            <legend className="font-bold text-lg">Visibility</legend>
                            <div className="form-control mb-2">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Public</span>
                                    <input id="visibility-public" type="radio" value="public" className="radio checked:bg-primary"
                                        {...register("visibility")} defaultChecked autoComplete="off"
                                        onClick={(e: any) => setIsPublicChecked(e.target.value === "public")} />
                                </label>
                            </div>
                            <div className="form-control mb-2">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Private</span>
                                    <input id="visibility-private" type="radio" value="private" className="radio checked:bg-primary"
                                        {...register("visibility")} autoComplete="off"
                                        onClick={(e: any) => setIsPublicChecked(e.target.value === "public")} />
                                </label>
                            </div>
                            {errors.visibility && <p className="text-error text-sm">Please select one option.</p>}
                            <label className="label">
                                {isPublicChecked ?
                                    <span className="label-text-alt">Public workspaces can be seen by other users but only invited members can edit it.</span>
                                    :
                                    <span className="label-text-alt">Private workspaces can only be seen and edited by you and invited members.</span>
                                }
                            </label>
                        </fieldset>
                        <div className="w-full">
                            <InviteBtnModal inviteUserFn={toggleInvitedUsers} invitedUsersIDs={invitedUsersIDs} />
                            <label className="label">
                                <span className="label-text-alt">You can invite other users to collaborate on your workspace.</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary text-lg normal-case w-full mx-auto rounded">
                    {isLoading ? <span className="loading loading-spinner"></span>
                        :
                        "Create new workspace"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateWorkspaceForm;