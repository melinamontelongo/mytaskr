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
                {...provided.draggableProps} 
                ref={provided.innerRef} 
                className="bg-base-300 w-64 h-fit shadow-xl rounded">
                    <div className="py-2 px-4" {...provided.dragHandleProps}>
                        <h3 className="font-bold text-xl">{list.name}</h3>
                        {/* TODO: EDIT AND DELETE LIST */}
                    </div>
                    <div className="overflow-y-auto w-64 min-h-[3rem] max-h-[calc(100vh-20rem)]">
                        <div className="px-2 min-h-[3rem] max-h-[calc(100vh-20rem)]">
                            <div className="min-h-[3rem] max-h-[calc(100vh-20rem)]">
                                <Droppable droppableId={list.id} type="task">
                                    {provided => (
                                        <div className="min-h-[3rem] max-h-[calc(100vh-20rem)]"
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
                    <div className="p-2">
                        <CreateTaskBtnModal listId={list.id} />
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default ListContainer;