"use client"
import { AiFillEdit } from "react-icons/ai";
import Modal from "../ui/Modal";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { UserProfileUpdate, UserProfileUpdateType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import axios from "axios";

interface UserProfileBtnModalProps {
    user: Pick<User, "name" | "email" | "image" | "username">,
}

const UserProfileBtnModal = ({ user }: UserProfileBtnModalProps) => {
    const router = useRouter();
    const profileUpdateModal = useRef<HTMLInputElement>(null);
    const { handleSubmit, register, formState: { errors } } = useForm<UserProfileUpdateType>({
        resolver: zodResolver(UserProfileUpdate),
        defaultValues: {
            username: user.username ?? "",
            name: user.name ?? "",
        }
    });
    const { mutate: updateProfile, isLoading: isUpdateLoading } = useMutation({
        mutationFn: async ({ username, name }: UserProfileUpdateType) => {
            const payload: UserProfileUpdateType = { username, name }
            const { data } = await axios.put(`/api/u/profile`, payload)
            return data;
        },
        onError: (err) => {
            toast.error("Could not edit profile.");
        },
        onSuccess: () => {
            toast.success("Profile edited successfully!");
            //  Close modal
            if (profileUpdateModal.current) profileUpdateModal.current.click()
            router.refresh();
        }
    })
    console.log(errors)
    return (
        <>
            {/* BTN */}
            <label htmlFor="updateUserProfile" className="btn btn-ghost btn-circle normal-case border-none flex items-center justify-center">
                <AiFillEdit className="text-base-content text-xl" />
            </label>

            {/* MODAL */}
            <Modal
                ref={profileUpdateModal}
                id={"updateUserProfile"}
                body={<>
                    <h3 className="font-bold text-2xl" id="modalTitle">Edit Profile</h3>
                    <form onSubmit={handleSubmit((e) => {
                        console.log(e)
                        updateProfile({ ...e })
                    }
                    )}>
                        <div className="flex flex-col md:flex-row justify-center md:gap-20 md:items-center">
                            <div className="flex flex-col gap-5 w-full">
{/*                                 <div className="mx-auto mt-4">
                                    <Avatar userImg={avatarImg} userName={user.name ?? user.email} />
                                </div> */}
                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Name</label>
                                    <input type="text" className={`input input-bordered rounded ${errors.name && "border-error"}`} {...register("name")} />
                                    {errors.name && <p className="text-error text-xs my-2">Invalid name.</p>}
                                    <label className="label">
                                        <span className="label-text-alt">This is your name.</span>
                                    </label>
                                </div>

                                <div className="form-control mb-2">
                                    <label className="label font-bold text-lg">Username</label>
                                    <input type="text" className={`input input-bordered rounded ${errors.username && "border-error"}`} {...register("username")} />
                                    {errors.username && <p className="text-error text-xs my-2">Username is required.</p>}
                                    <label className="label">
                                        <span className="label-text-alt">This is your username.</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary rounded normal-case">
                                {isUpdateLoading ? <span className="loading loading-spinner"></span>
                                    :
                                    "Save"
                                }
                            </button>
                            <label htmlFor={`updateUserProfile`} className="btn rounded normal-case">Cancel</label>
                        </div>
                    </form>
                </>}
            />
        </>
    )
}

export default UserProfileBtnModal;