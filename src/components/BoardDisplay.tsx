"use client"
import { Board, List, Task } from "@prisma/client";
import ListContainer from "./ListContainer";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ListUpdate, ListUpdateType, TaskUpdateType } from "@/lib/validators";

interface OrderedList extends ExtendedList {
    tasksIds: string[]
}
interface ExtendedList extends List {
    tasks: Task[]
}

interface ExtendedBoard extends Board {
    lists: ExtendedList[]
}

interface BoardDisplayProps {
    board: ExtendedBoard
}


const BoardDisplay = ({ board }: BoardDisplayProps) => {
    const router = useRouter();
    const [boardInfo, setBoardInfo] = useState(board);

    console.log(board)
    const { mutate: reorderTasks } = useMutation({
        mutationFn: async ({ taskId, listId, taskIds }: TaskUpdateType) => {
            const payload = { taskId, listId, taskIds }
            const { data } = await axios.patch("/api/b/create/task/", payload)
            return data;
        },//   TODO: TOASTS
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            console.log("success")
            router.refresh()
        }
    })

    const { mutate: reorderTasksBetweenLists } = useMutation({
        mutationFn: async ({ taskId, listId, taskIds }: TaskUpdateType) => {
            const payload = { taskId, listId, taskIds }
            const { data } = await axios.put("/api/b/create/task/", payload)
            return data;
        },//   TODO: TOASTS
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            console.log("success")
            router.refresh()
        }
    })

    const { mutate: reorderLists } = useMutation({
        mutationFn: async ({ listId, listsIds }: ListUpdateType) => {
            const payload = { listId, listsIds }
            const { data } = await axios.patch("/api/b/create/list/", payload)
            return data;
        },//   TODO: TOASTS
        onError: (err) => {
            return console.log(err)
        },
        onSuccess: () => {
            console.log("success")
            router.refresh()
        }
    })

    const onDragEnd = async (result: any) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        //  Dropped on same place
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return
        }
        //  If tasks are being handled
        if (type === "task") {
            const sourceList = board.lists.filter((list) => list.id === source.droppableId)[0];
            const destinationList = board.lists.filter((list) => list.id === destination.droppableId)[0];
            //  Moving task on same list
            if (sourceList === destinationList) {
                //  Array of task IDs
                const taskIds = sourceList.tasks.map((task) => task.id)
                //  Re-order ids
                taskIds.splice(source.index, 1);
                taskIds.splice(destination.index, 0, draggableId);

                //  Modify db
                reorderTasks({ taskId: draggableId, listId: sourceList.id, taskIds })

                //  Update UI
                const taskArr: any = [];
                taskIds.map((id) => {
                    sourceList.tasks.map((t) => {
                        if (t.id === id) taskArr.push(t)
                        return
                    })
                    return taskArr;
                })
                const orderedList = {
                    ...sourceList,
                    tasks: taskArr
                }
                const updatedLists: ExtendedList[] = boardInfo.lists.map((l) => {
                    if (l.id === orderedList.id) {
                        l = orderedList;
                    }
                    return l;
                })
                //  Update state
                setBoardInfo({ ...boardInfo, lists: updatedLists });
                return;
            }

            //  Moving task to another list
            //  Change source list
            const sourceTaskIds = sourceList.tasks.map((task) => task.id);
            sourceTaskIds.splice(source.index, 1);
            const sourceTaskArr: any = [];
            sourceTaskIds.map((id) => {
                sourceList.tasks.map((t) => {
                    if (t.id === id) sourceTaskArr.push(t)
                    return
                })
                return sourceTaskArr;
            })
            const orderedSourceList = {
                ...sourceList,
                tasks: sourceTaskArr,
            };
            //  Change destination list
            const destinationTaskIds = destinationList.tasks.map((task) => task.id);
            destinationTaskIds.splice(destination.index, 0, draggableId);
            const destinationTaskArr: any = [];
            destinationTaskIds.map((id) => {
                //  Get destination tasks
                destinationList.tasks.map((t) => {
                    if (t.id === id) destinationTaskArr.push(t);
                    return;
                })
                //  Find new task on source list
                sourceList.tasks.map((t) => {
                    if (t.id === id) destinationTaskArr.push(t);
                    return;
                })
                return destinationTaskArr;
            })
            const orderedDestinationList = {
                ...destinationList,
                tasks: destinationTaskArr,
            };

            //  Modify db
            reorderTasksBetweenLists({ taskId: draggableId, listId: destinationList.id, taskIds: destinationTaskIds })

            const updatedLists: ExtendedList[] = board.lists.map((l) => {
                if (l.id === sourceList.id) {
                    l = orderedSourceList;
                }
                if (l.id === destinationList.id) {
                    l = orderedDestinationList;
                }
                return l;
            });
            setBoardInfo({ ...boardInfo, lists: updatedLists });
            return;
        }
        //  If lists are being handled
        if (type === "list") {
            console.log(board.lists)
            const boardListsIds = board.lists.map((list) => list.id);
            boardListsIds.splice(source.index, 1);
            boardListsIds.splice(destination.index, 0, draggableId);
            //  Modify list index on db
            reorderLists({listId: draggableId, listsIds: boardListsIds})

            //  Update UI
            const listArr: any = [];
            boardListsIds.map((id) => {
                board.lists.map((l) => {
                    if (l.id === id) listArr.push(l)
                    return
                })
                return listArr;
            })
            setBoardInfo({...boardInfo, lists: listArr})
        }

    }

    return (
        <div className="">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="listsDroppable" direction="horizontal" type="list">
                    {provided => (
                        <div className="flex flex-row gap-5"{...provided.droppableProps} ref={provided.innerRef}>
                            {boardInfo.lists.map((list, index) => {
                                return <ListContainer key={list.id} list={list} index={index} />
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default BoardDisplay;