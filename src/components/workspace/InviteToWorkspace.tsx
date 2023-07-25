"use client"

import { useState } from "react";
import InviteBtnModal from "./InviteBtnModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { WorkspaceInviteType } from "@/lib/validators";
import { useRouter } from "next/navigation";

interface InviteToWorkspaceProps {
    workspaceId: string,
}

const InviteToWorkspace = ({ workspaceId }: InviteToWorkspaceProps) => {
    const router = useRouter();
    const [invitedUsersIDs, setInvitedUsersIDs] = useState<string[]>([]);

    const { mutate: invite, isLoading } = useMutation({
        mutationFn: async (invitedUsers: string[]) => {
            const payload: WorkspaceInviteType = { invitedUsers, workspaceId }
            const { data } = await axios.patch("/api/w/invite", payload);
            return data;
        },
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            return console.log("success")
        },
    })

    const toggleInvitedUsers = (newID: string) => {
        const alreadyExists = invitedUsersIDs?.filter((id) => id === newID);
        // Remove
        if (alreadyExists.length > 0) {
            const newInvitedUsersArr = invitedUsersIDs.filter((id) => id !== newID)
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
            alert("No invited users, select some and try again")
        }
        router.refresh();
    }
    const inviteActionContent = <button className="btn btn-primary normal-case rounded" onClick={() => inviteUsers()}>Invite</button>
    return <>
        <InviteBtnModal
            inviteUserFn={toggleInvitedUsers}
            invitedUsersIDs={invitedUsersIDs}
            inviteActionContent={inviteActionContent}
            workspaceID={workspaceId}
        />
    </>
}

export default InviteToWorkspace;