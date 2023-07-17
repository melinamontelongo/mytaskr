"use client"
import { Task } from "@prisma/client"
import { Draggable } from "react-beautiful-dnd";
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';

interface ListItemProps {
    task: Task,
    index: number,
    isTaskLoading: boolean,
}


const ListItem = ({ task, index, isTaskLoading }: ListItemProps) => {

    return (<>
        <Draggable draggableId={task.id} index={index} isDragDisabled={isTaskLoading}>
            {(provided, snapshot) => (
                <NaturalDragAnimation
                    style={provided.draggableProps.style}
                    snapshot={snapshot}>
                    {style => (
                        <div
                            id={task.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-full bg-base-100 min-h-16 px-4 py-2 my-2 shadow-xl transition-all`}
                            style={style}>
                            <p className="break-all">{task.name}</p>
                        </div>
                    )}
                </NaturalDragAnimation>
            )}
        </Draggable>
    </>
    )
}

export default ListItem;