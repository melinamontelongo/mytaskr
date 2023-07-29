"use client"
import { UploadButton } from "@/lib/uploadthing";
import Modal from "../ui/Modal";
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import "@uploadthing/react/styles.css";
import { useRouter } from "next/navigation";
import axios from "axios";

const UserProfilePicModal = () => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const userPicModal = useRef<HTMLInputElement>(null);
    const deletePicture = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/uploadthing`);
            toast.success("Profile picture deleted successfully!");
        } catch (error) {
            toast.error("Something went wrong.");
        }finally{
            setIsDeleting(false);
            if (userPicModal.current) userPicModal.current.click();
            router.refresh();
        }
    }
    return (
        <Modal
            ref={userPicModal}
            id="userProfilePicModal"
            body={<>
                <h3 className="font-bold text-2xl text-center" id="modalTitle">Change profile picture</h3>
                <div className="flex flex-col justify-center gap-2">
                    <div style={{ fontFamily: "inherit" }} className="my-4">
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                if (userPicModal.current) userPicModal.current.click();
                                toast.success("Profile picture uploaded successfully!")
                                router.refresh();
                            }}
                            onUploadError={(error: Error) => {
                                if (userPicModal.current) userPicModal.current.click();
                                toast.error("An error occurred while uploading your image");
                            }}
                        />
                    </div>
                    <button type="button" className="btn btn-outline btn-error rounded normal-case" onClick={() => deletePicture()}>
                        {isDeleting ? <span className="loading loading-spinner"></span> : "Delete current picture"}
                    </button>
                    <button type="button" className="btn bg-base-300 rounded normal-case" onClick={() => userPicModal?.current?.click()}>
                        Cancel
                    </button>
                </div>
            </>}
        />
    )
}

export default UserProfilePicModal;