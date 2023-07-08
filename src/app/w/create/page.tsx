import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";
import { getAuthSession } from "@/lib/auth";

const CreateWorkspacePage = async() => {
    const session = await getAuthSession();
    if(!session) return null;
    return (
        <div>
            <CreateWorkspaceForm user={session.user}/>
        </div>
    )
}

export default CreateWorkspacePage;