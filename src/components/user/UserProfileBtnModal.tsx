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
import axios, { AxiosError } from "axios";

interface UserProfileBtnModalProps {
    user: Pick<User, "name" | "email" | "image" | "username">,
}

const UserProfileBtnModal = ({ user }: UserProfileBtnModalProps) => {
    const router = useRouter();
    const profileUpdateModal = useRef<HTMLInputElement>(null);
    const { handleSubmit, register, formState: { errors }, reset } = useForm<UserProfileUpdateType>({
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
            if(err instanceof AxiosError && err.response) return toast.error(err.response.data);
            toast.error("Could not edit profile.");
        },
        onSuccess: () => {
            toast.success("Profile edited successfully!");
            router.refresh();
        },
        onSettled: () => {
            reset();
            //  Close modal
            if (profileUpdateModal.current) profileUpdateModal.current.click()
        }
    });
    return (
        <>
            <label htmlFor="updateUserProfile" className="btn btn-ghost btn-circle normal-case border-none flex items-center justify-center">
                <AiFillEdit className="text-base-content text-xl" />
            </label>

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
                            <label htmlFor={`updateUserProfile`} className="btn bg-base-300 rounded normal-case">Cancel</label>
                        </div>
                    </form>
                </>}
            />
        </>
    )
}

export default UserProfileBtnModal;