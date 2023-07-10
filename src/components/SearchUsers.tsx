"use client"

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { User } from "next-auth";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

interface SearchUsersProps {
    inviteUserFn: Function,
    invitedUserIDs: string[],
}

const SearchUsers = ({ inviteUserFn, invitedUserIDs }: SearchUsersProps) => {
    const [input, setInput] = useState<string>("");
    const { data: usersQueryResults, refetch, isFetched, isFetching, isRefetching } = useQuery({
        queryFn: async () => {
            if (!input) return [];
            const { data } = await axios.get(`/api/u/search?u=${input}`);
            console.log(data)
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
        {input.length > 0 ? (
            <ul className="flex flex-row my-5 mx-2">
                {usersQueryResults?.length > 0 && (
                    usersQueryResults.map((u: User) => {
                        return (
                            <li onClick={() => inviteUserFn(u.id)}
                                className={`btn ${invitedUserIDs?.includes(u.id) ? "btn-success" : "btn-secondary"} normal-case btn-sm rounded-full`}
                                key={u.id}>
                                <span>{u.email}</span>
                                <span>{invitedUserIDs?.includes(u.id) ? <IoMdRemove /> : <IoMdAdd />}</span>
                            </li>
                        )
                    })
                )}
            </ul>
        )
            :
            null
        }
    </>
    )
}
export default SearchUsers;