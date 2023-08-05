"use client"
import Link from "next/link";
import { dateFormatter } from "@/lib/dateFormatter";
import { Activity, Board, Workspace } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface ExtendedBoard extends Board {
    workspace: Pick<Workspace, "name"> | null,
};
interface ExtendedActivity extends Activity {
    board: Pick<ExtendedBoard, "workspaceID" | "workspace"> | null,
};
interface UserProfileActivityProps {
    initialActivity: {
        count: number,
        activity: ExtendedActivity[] | null
    },
};
const UserProfileActivity = ({ initialActivity }: UserProfileActivityProps) => {
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["activityQuery"],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await axios.get(`/api/u/profile/activity?limit=${5}&page=${pageParam}`);
            return data;
        },
        getNextPageParam: (prev, pages) => {
            if (prev.count / 5 >= pages.length) {
                return pages.length + 1
            } else {
                //  No next page
                return undefined;
            }
        },
        initialData: { pages: [initialActivity], pageParams: [1] }
    });
    const activity = data?.pages.flatMap((page) => page.activity) ?? initialActivity.activity;
    return (<>
        <ul className="flex flex-col gap-4">
            {activity ? activity.map((a) => {
                return (<>
                    <li key={a.id}>
                        <p>{a.description} { }
                            {a.type.includes("Board") &&
                                (a.boardId ? <><Link className="text-primary hover:underline" href={`/b/${a.boardId}`}>{a.name}</Link> on <Link className="text-primary hover:underline" href={`/w/${a.board?.workspaceID}`}>{a.board?.workspace?.name}</Link></>
                                    :
                                    <>
                                        <span className="text-neutral-500">{a.name}</span>
                                        {a.board?.workspaceID ? <>on <Link href={a.board?.workspaceID}>{a.board?.workspace?.name}</Link></>
                                            :
                                            a.board?.workspace?.name && <> on <span className="text-neutral-500">{a.board?.workspace.name}</span></>
                                        }
                                    </>
                                )}
                            {a.type.includes("Workspace") &&
                                (a.workspaceId ? <Link className="text-primary hover:underline" href={`/w/${a.workspaceId}`}>{a.name}</Link>
                                    :
                                    <span className="text-neutral-500">{a.name}</span>)}
                        </p>
                        <p className="text-sm">{dateFormatter(a.createdAt)}</p>
                    </li>
                </>
                )
            })
                :
                <li>You have no activity.</li>
            }
            {hasNextPage ?
                (
                    <button className="btn btn-sm bg-base-200 normal-case rounded" onClick={() => fetchNextPage()} disabled={!hasNextPage}>
                        {isFetchingNextPage ? <span className="loading loading-spinner"></span> : "Load more activity"}
                    </button>
                )
                :
                null
            }
        </ul>
    </>
    )
}

export default UserProfileActivity;