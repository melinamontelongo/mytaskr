"use client"

import { useRef, useState } from "react";
import InviteBtnModal from "./InviteBtnModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { WorkspaceInviteType } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface InviteToWorkspaceProps {
    workspaceId: string,
    isMember: boolean,
}

const InviteToWorkspace = ({ workspaceId, isMember }: InviteToWorkspaceProps) => {
    const router = useRouter();
    const inviteModal = useRef<HTMLInputElement>(null);
    const [invitedUsersIDs, setInvitedUsersIDs] = useState<string[]>([]);

    const { mutate: invite, isLoading } = useMutation({
        mutationFn: async (invitedUsers: string[]) => {
            const payload: WorkspaceInviteType = { invitedUsers, workspaceId }
            const { data } = await axios.patch("/api/w/invite", payload);
            return data;
        },
        onError: (err) => {
            toast.error("Users could not be invited, try again.");
        },
        onSuccess: () => {
            toast.success("Users invited successfully!");
            router.refresh();
        },
        onSettled: () => {
            //  Close modal
            if(inviteModal?.current) inviteModal?.current?.click();
        }
    })

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

    const inviteUsers = () => {
        if (invitedUsersIDs.length > 0) {
            invite(invitedUsersIDs)
        } else {
            toast.error("No invited users, select some and try again")
        }
        router.refresh();
    }
    const inviteActionContent = <button className="btn btn-primary normal-case rounded" onClick={() => inviteUsers()} disabled={!isMember}>
        {isLoading ? <span className="loading loading-spinner"></span> : "Invite"}
    </button>
    return <>
        <InviteBtnModal
            ref={inviteModal}
            inviteUserFn={toggleInvitedUsers}
            invitedUsersIDs={invitedUsersIDs}
            inviteActionContent={inviteActionContent}
            workspaceID={workspaceId}
            isMember={isMember}
        />
    </>
}

export default InviteToWorkspace;