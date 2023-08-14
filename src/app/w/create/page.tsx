import Footer from "@/components/ui/Footer";
import CreateWorkspaceForm from "@/components/workspace/CreateWorkspaceForm";
import { getAuthSession } from "@/lib/auth";

const CreateWorkspacePage = async () => {
    const session = await getAuthSession();
    if (!session) return null;
    return (<>
        <div className="min-h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-5 pt-24 pb-10 box-content">
            <div className="flex flex-col space-y-5">
                <div>
                    <h1 className="font-extrabold text-4xl text-center">Create Workspace</h1>
                </div>
                <CreateWorkspaceForm />
            </div>
        </div>
        <Footer />
    </>
    )
}

export default CreateWorkspacePage;