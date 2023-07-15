"use client"
import { Board, List, Task } from "@prisma/client";
import ListContainer from "./ListContainer";
import { DragDropContext } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface OrderedList extends ExtendedList{
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
type mutationProps = {
    taskId: string,
    listId: string,
    taskIds: string[]
}
const BoardDisplay = ({ board }: BoardDisplayProps) => {
    const router = useRouter();
    const [lists, setLists] = useState(board.lists);
    useEffect(() => {
        console.log(lists)
    }, [lists]) 
    const {mutate: reorderTasks} = useMutation({
        mutationFn: async({taskId, listId, taskIds}:mutationProps) => {
            const payload = {taskId, listId, taskIds}
            const {data} = await axios.patch("/api/b/create/task/", payload)
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
    const onDragEnd = async(result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        //  Dropped on same place
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return
        }
        //  List
        const list = board.lists.filter((list) => list.id === source.droppableId)[0];
        const taskIds = list.tasks.map((task) => task.id)
        //  Re-order ids
        taskIds.splice(source.index, 1);
        taskIds.splice(destination.index, 0, draggableId);

        reorderTasks({taskId: draggableId, listId: list.id, taskIds})

        //  Update UI

        const taskArr:any = [];
        taskIds.map((id) => {
            list.tasks.map((t) => {
                if(t.id === id) taskArr.push(t)
                return
            })
            return taskArr;
        })
        const orderedList = {
            ...list,
            tasks: taskArr
        }
        const updatedLists = lists.map((l) => {
            if(l.id === orderedList.id){
                l = orderedList;
            }
            return l;
        })
        setLists(updatedLists);
    }

    return (
        <div className="flex flex-row gap-5">
            <DragDropContext onDragEnd={onDragEnd}>
                {lists.map((list) => {
                    return <ListContainer key={list.id} list={list} />
                })}
            </DragDropContext>
        </div>
    )
}

export default BoardDisplay;