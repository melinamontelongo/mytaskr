import React from "react";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import DisplayCard from "./ui/DisplayCard";

const Dashboard = async () => {
    const session = await getAuthSession();
    const user = await db.user.findUnique({
        where: {
            id: session?.user.id,
        },
        select: {
            name: true,
            email: true,
            workspaces: {
                orderBy: {
                    updatedAt: "desc"
                },
                include: {
                    boards: {
                        orderBy: {
                            updatedAt: "desc"
                        }
                    }
                }
            },
            createdWorkspaces: {
                orderBy: {
                    updatedAt: "desc"
                },
                include: {
                    boards: {
                        orderBy: {
                            updatedAt: "desc"
                        }
                    }
                }
            },
        }
    })
    if (!user) return null;
    return (
        <div className="h-full max-w-2xl mx-auto flex flex-col gap-5 md:pt-30 pt-36 box-content">
            <h1 className="text-2xl font-bold">Welcome, {user.name ? user.name : user.email}.</h1>
            <div className="divider"></div>
            <div>
                <h3 className="text-2xl font-bold">Your workspaces</h3>
                <div className="flex md:flex-row flex-col md:flex-wrap gap-4 my-4">
                    {user.workspaces || user.createdWorkspaces ? (<>
                        {user.workspaces?.map((w) => {
                            return (
                                <DisplayCard key={w.id} linkHref={`/w/${w.id}`} title={w.name} text={w.description} />
                            )
                        })}
                        {user.createdWorkspaces?.map((w) => {
                            return (
                                <DisplayCard key={w.id} linkHref={`/w/${w.id}`} title={w.name} text={w.description} />
                            )
                        })}
                    </>)
                        :
                        <p>You have no workspaces. <Link href="w/create" className="underline">Create one.</Link></p>
                    }
                </div>
            </div>
            <div className="divider"></div>
            <div>
                <h3 className="text-2xl font-bold">Your boards</h3>
                <div className="flex md:flex-row flex-col flex-wrap gap-4 my-4">
                    {user.workspaces || user.createdWorkspaces ? (<>
                        {user.workspaces?.map((w) => {
                            return (
                                <React.Fragment key={`workspaces${w.id}`}>
                                    {w.boards.map((board) => {
                                        return (
                                            <DisplayCard key={board.id} linkHref={`/b/${board.id}`} title={board.name} text={board.description} />
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                        {user.createdWorkspaces?.map((w) => {
                            return (
                                <React.Fragment key={`createdWorkspaces${w.id}`}>
                                    {w.boards.map((board) => {
                                        return (
                                            <DisplayCard key={board.id} linkHref={`/b/${board.id}`} title={board.name} text={board.description} />
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </>)
                        :
                        <p>You have no boards. <Link href="board/create" className="underline">Create one.</Link></p>
                    }
                </div>
            </div>
        </div>
    );
};
export default Dashboard;