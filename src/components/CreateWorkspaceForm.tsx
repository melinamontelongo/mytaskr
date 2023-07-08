"use client"
import { WorkspaceCreation, WorkspaceCreationType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";

interface CreateWorkspaceFormProps{
    user: Pick<User, "id">
}

const CreateWorkspaceForm = ({user}:CreateWorkspaceFormProps) => {
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm<WorkspaceCreationType>({
        resolver: zodResolver(WorkspaceCreation)
    })
    const {mutate: createWorkspace, isLoading} = useMutation({
        mutationFn: async({name, description, isPublic, usersIDs}:WorkspaceCreationType) => {
            const payload: WorkspaceCreationType = {name, description, isPublic, usersIDs }
            const {data} = await axios.post("/api/workspace/create");
            return data;
        },
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            return console.log("success")
        },
    })
    return (
        <form onSubmit={handleSubmit((e) => createWorkspace(e))}>
             
             <div className="form-control mb-2">
                    <label className="label">Name</label>
                    <input type="text" className="input input-bordered" {...register("name")} />
                    {errors.name && <p className="text-error">Invalid workspace name</p>}
                </div>

                <div className="form-control mb-2">
                    <label className="label">Description</label>
                    <textarea className="textarea textarea-bordered"  {...register("description")}/>
                    {errors.name && <p className="text-error">Invalid description</p>}
                </div>

        </form>
    )
}

export default CreateWorkspaceForm;