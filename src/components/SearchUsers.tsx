"use client"
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { User } from "next-auth";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";

interface SearchUsersProps {
    inviteUserFn: Function,
    invitedUsersIDs: string[],
    workspaceID?: string | null
}

const SearchUsers = ({ inviteUserFn, invitedUsersIDs, workspaceID }: SearchUsersProps) => {
    const [input, setInput] = useState<string>("");
    const { data: usersQueryResults, refetch, isFetched, isFetching, isRefetching } = useQuery({
        queryFn: async () => {
            if (!input) return [];
            const { data } = await axios.get(`/api/u/search?u=${input}${workspaceID ? `&w=${workspaceID}` : ""}`);
            return data;
        },
        queryKey: ["search-users"],
        enabled: false, //Only make request when user types
    })

    //  Debounce
    const request = debounce(() => {
        refetch();
    }, 300)
    const debounceRequest = useCallback(() => {
        request();
    }, []);

    return (<>
        <input
            type="text"
            className="input input-bordered"
            value={input}
            onInput={(e: any) => {
                setInput(e.target.value)
                debounceRequest();
            }} />
        <div className="flex items-center h-16">
            {input.length > 0 ? (<>
                {isFetching && <BiLoaderAlt className="animate-spin text-2xl mx-auto" />}
                <ul className="flex flex-row mx-2 my-2">
                    {usersQueryResults && usersQueryResults?.length > 0 ? (
                        usersQueryResults?.map((u: User) => {
                            return (
                                <li onClick={() => inviteUserFn(u.id)}
                                    className={`btn ${invitedUsersIDs?.includes(u.id) ? "btn-success" : "btn-secondary"} normal-case btn-sm rounded-full`}
                                    key={u.id}>
                                    <span>{u.email}</span>
                                    <span>{invitedUsersIDs?.includes(u.id) ? <IoMdRemove /> : <IoMdAdd />}</span>
                                </li>
                            )
                        })
                    )
                        :
                        !isFetching && !isRefetching && isFetched && <p>No users found.</p>
                    }
                </ul>
            </>)
                :
                null
            }
        </div>
    </>
    )
}
export default SearchUsers;