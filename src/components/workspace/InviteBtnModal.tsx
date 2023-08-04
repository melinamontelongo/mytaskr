import { ForwardedRef, ReactNode, forwardRef } from "react";
import SearchUsers from "./SearchUsers";
import Modal from "../ui/Modal";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

interface InviteBtnModalProps {
    inviteUserFn: Function,
    invitedUsersIDs: string[],
    inviteActionContent?: ReactNode,
    workspaceID?: string | null,
    isMember?: boolean,
}

const InviteBtnModal = forwardRef(({ inviteUserFn, invitedUsersIDs, inviteActionContent, workspaceID, isMember }: InviteBtnModalProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (<>
        <button disabled={isMember !== undefined ? !isMember : false} className="btn bg-base-300 normal-case w-full border-none rounded">
            <label htmlFor="addUsersModal" className="flex items-center justify-center w-full h-full cursor-pointer p-0 m-0">
                <AiOutlineUsergroupAdd className={`${isMember ? "text-base-content" : ""} text-xl`} /> Invite
            </label>
        </button>

        <Modal
            ref={ref}
            id={"addUsersModal"}
            body={<>
                <h3 className="font-bold text-lg text-center" id="modalTitle">Invite users</h3>
                <div className="form-control mb-2">
                    <label className="label font-bold text-lg">Email</label>
                    {/* search and display users to invite */}
                    <SearchUsers inviteUserFn={inviteUserFn} invitedUsersIDs={invitedUsersIDs} workspaceID={workspaceID} />
                </div>
            </>}
            actionContent={<>
                {inviteActionContent !== undefined && inviteActionContent}
                <label htmlFor="addUsersModal" className="btn bg-base-300 rounded normal-case">Close</label>
            </>}
        />
    </>
    )
})

InviteBtnModal.displayName = "InviteBtnModal";

export default InviteBtnModal;