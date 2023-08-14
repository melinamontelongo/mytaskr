import UserProfile from "@/components/user/UserProfile";
import { getAuthSession } from "@/lib/auth";

const ProfilePage = async () => {
    const session = await getAuthSession();

    if (!session?.user) return null;
    
    return (
        <>
            <div className="min-h-screen max-w-2xl mx-auto flex flex-col gap-5 p-24 px-5 box-content">
                <UserProfile />
            </div>
        </>
    )

}

export default ProfilePage;