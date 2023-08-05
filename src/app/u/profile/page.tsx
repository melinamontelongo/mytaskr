import UserProfile from "@/components/user/UserProfile";
import { getAuthSession } from "@/lib/auth";

const ProfilePage = async () => {
    const session = await getAuthSession();

    if (!session?.user) return null;
    
    return (
        <>
            <div className="h-full max-w-2xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
                <UserProfile />
            </div>
        </>
    )

}

export default ProfilePage;