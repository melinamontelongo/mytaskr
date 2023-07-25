import { ReactNode } from "react";
import SearchUsers from "./SearchUsers";
import Modal from "../ui/Modal";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

interface InviteBtnModalProps {
    inviteUserFn: Function,
    invitedUsersIDs: string[],
    inviteActionContent?: ReactNode,
    workspaceID?: string | null,
}

const InviteBtnModal = ({ inviteUserFn, invitedUsersIDs, inviteActionContent, workspaceID }: InviteBtnModalProps) => {
    return (<>
        <label htmlFor="addUsersModal" className="btn bg-base-300 normal-case w-full border-none flex items-center justify-center rounded">
            <AiOutlineUsergroupAdd className="text-base-content text-xl" /> Invite
        </label>
        
        <Modal
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
}

export default InviteBtnModal;