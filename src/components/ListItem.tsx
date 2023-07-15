"use client"

import { Task } from "@prisma/client"
import { Draggable } from "react-beautiful-dnd";

interface ListItemProps {
    task: Task,
    index: number,
}

const ListItem = ({ task, index }: ListItemProps) => {

    return (<>
    <Draggable draggableId={task.id} index={index}>
        {provided => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="w-full bg-base-100 min-h-16 px-4 py-2 my-2 shadow-xl">
                <p className="break-all">{task.name}</p>
            </div>
        )}
    </Draggable>
    </>
    )
}

export default ListItem;