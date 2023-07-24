import Image from "next/image";

interface AvatarProps {
    userImg: string | null | undefined,
    userName: string,
}

const Avatar = ({ userImg, userName }: AvatarProps) => {

    return (<>
        {userImg ?
            <div className="avatar">
                <div className="w-10 rounded-full bg-primary aspect-square">
                    <Image className="rounded-full" src={userImg} alt={"Profile picture"} fill />
                </div>
            </div>
            :
            <div className="avatar placeholder">
                <div className="rounded-full w-10 bg-neutral-focus text-neutral-content">
                    <span className="text-3xl">{userName[0]}</span>
                </div>
            </div>
        }
    </>
    )
}

export default Avatar;