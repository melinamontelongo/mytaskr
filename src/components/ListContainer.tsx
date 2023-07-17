"use client"
import { List, Task } from "@prisma/client";
import ListItem from "./ListItem";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CreateTaskBtnModal from "./CreateTaskBtnModal";

interface ExtendedList extends List {
    tasks: Task[]
}
interface ListContainerProps {
    list: ExtendedList,
    index: number,
    isListLoading: boolean,
    isTaskLoading: boolean,
}

const ListContainer = ({ list, index, isListLoading, isTaskLoading }: ListContainerProps) => {

    return (
        <Draggable draggableId={list.id} index={index} isDragDisabled={isListLoading}>
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
                        <div className="px-2 pb-2 h-[22rem]">
                            <div className="h-full">
                                <Droppable droppableId={list.id} type="task">
                                    {provided => (
                                        <div className="h-full"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            {list.tasks.map((task, index) => {
                                                return <ListItem key={task.id} task={task} index={index} isTaskLoading={isTaskLoading}/>
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