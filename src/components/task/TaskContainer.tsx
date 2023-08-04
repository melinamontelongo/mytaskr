"use client"
import { Task } from "@prisma/client"
import { Draggable } from "react-beautiful-dnd";
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';
import { AiFillEdit } from "react-icons/ai";

interface TaskContainerProps {
    task: Task,
    index: number,
    isTaskLoading: boolean,
    setCurrentTask: Function,
    isUserMember: boolean,
}

const TaskContainer = ({ task, index, isTaskLoading, setCurrentTask, isUserMember }: TaskContainerProps) => {
    return (<>
        <Draggable draggableId={task.id} index={index} isDragDisabled={isTaskLoading || !isUserMember}>
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
                            className={`group w-full bg-base-100 min-h-16 px-4 py-2 my-2 shadow-xl transition-all rounded`}
                            style={style}>
                            <div className="flex justify-between items-center" >
                                <p className="break-word">{task.name}</p>
                                {isUserMember ?
                                    (
                                        <label htmlFor={`taskModal`} className="btn btn-sm btn-ghost rounded invisible group-hover:visible" onClick={() => setCurrentTask(task)}>
                                            <AiFillEdit />
                                        </label>
                                    )
                                    :
                                    (
                                        <button className="btn btn-sm btn-ghost rounded invisible group-hover:visible" disabled>
                                            <AiFillEdit />
                                        </button>
                                    )
                                }

                            </div>
                        </div>
                    )}
                </NaturalDragAnimation>
            )}
        </Draggable>
    </>
    )
}

export default TaskContainer;