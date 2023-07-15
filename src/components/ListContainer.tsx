"use client"
import { List, Task } from "@prisma/client";
import ListItem from "./ListItem";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRef } from "react";
import CreateTaskBtnModal from "./CreateTaskBtnModal";

interface ExtendedList extends List {
    tasks: Task[]
}
interface ListContainerProps {
    list: ExtendedList,
    index: number,
}

const ListContainer = ({ list, index }: ListContainerProps) => {
    return (
        <Draggable draggableId={`draggable${list.id}`} index={index}>
            {provided => ( 
                <div 
                {...provided.dragHandleProps}
                {...provided.draggableProps} 
                ref={provided.innerRef} 
                className="bg-base-300 w-64 h-[30rem] shadow-xl">
                    <div className="py-2 px-4">
                        <h3 className="font-bold text-xl">{list.name}</h3>
                    </div>
                    <div className="overflow-y-auto w-64 h-96">
                        <div className="px-2 pb-2">
                            <div>
                                <Droppable droppableId={`droppable${list.id}`} type="task">
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            {list.tasks.map((task, index) => {
                                                return <ListItem key={task.id} task={task} index={index} />
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    </div>
                    {/* FOOTER */}
                    <div className="py-2 px-4">
                        <CreateTaskBtnModal listId={list.id} />
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default ListContainer;