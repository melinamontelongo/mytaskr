import { ReactNode } from "react";
import SearchUsers from "./SearchUsers";

interface InviteBtnModalProps {
    inviteUserFn: Function,
    invitedUsersIDs: string[],
    inviteActionContent?: ReactNode,
    workspaceID?: string | null,
}

const InviteBtnModal = ({ inviteUserFn, invitedUsersIDs, inviteActionContent, workspaceID }: InviteBtnModalProps) => {
    return (<>
        {/* BTN */}
        <label htmlFor="addUsersModal" className="btn bg-base-300 normal-case w-full">Invite users</label>

        {/* MODAL */}
        <input type="checkbox" id="addUsersModal" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Invite</h3>

                <div className="form-control mb-2">
                    <label className="label font-bold text-lg">Email</label>
                    {/* search and display users to invite */}
                    <SearchUsers inviteUserFn={inviteUserFn} invitedUsersIDs={invitedUsersIDs} workspaceID={workspaceID}  />
                </div>

                <div className="modal-action">
                    {inviteActionContent !== undefined && inviteActionContent}
                    <label htmlFor="addUsersModal" className="btn">Close</label>
                </div>
            </div>
        </div>
    </>
    )
}

export default InviteBtnModal;