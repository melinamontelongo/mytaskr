"use client"

import { WorkspaceUninviteType } from "@/lib/validators"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { AiOutlineClose } from "react-icons/ai"

interface UninviteUserBtn {
    userId: string,
    workspaceId: string,
}
const UninviteUserBtn = ({ userId, workspaceId }: UninviteUserBtn) => {
    const router = useRouter();
    const { mutate: uninviteUser, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: WorkspaceUninviteType = { uninvitedUser: userId, workspaceId }
            const { data } = await axios.put(`/api/w/uninvite/`, payload)
            return data;
        },
        onError: (err) => {
            toast.error("Could not remove user from this workspace.");
        },
        onSuccess: () => {
            toast.success("User removed from this workspace.");
            router.refresh();
        },
    })
    return (
        <div className="tooltip" data-tip="Remove user">
            <button aria-label="Remove user" className="btn btn-sm btn-ghost btn-circle" onClick={() => uninviteUser()}>
                {isLoading ? <span className="loading loading-spinner"></span> : <AiOutlineClose />}
            </button>
        </div>
    )
}

export default UninviteUserBtn;