"use client"
import { List, Task } from "@prisma/client";
import TaskContainer from "../task/TaskContainer";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CreateTaskBtnModal from "../task/CreateTaskBtnModal";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Dropdown from "../ui/Dropdown";

interface ExtendedList extends List {
    tasks: Task[]
}
interface ListContainerProps {
    list: ExtendedList,
    index: number,
    isListLoading: boolean,
    isTaskLoading: boolean,
    setDeleteList: Function,
    setUpdateList: Function,
    setCurrentTask: Function,
}

const ListContainer = ({ list, index, isListLoading, isTaskLoading, setDeleteList, setUpdateList, setCurrentTask }: ListContainerProps) => {

    const showDeleteModal = () => {
        setDeleteList(list);
    }
    const showUpdateModal = () => {
        setUpdateList(list);
    }
    return (<>
        <Draggable draggableId={list.id} index={index} isDragDisabled={isListLoading}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="bg-base-200 w-64 h-fit shadow-xl rounded">
                    <div className="py-2 px-4 flex items-center justify-between" {...provided.dragHandleProps}>
                        <h3 className="font-bold text-xl">{list.name}</h3>
                        <Dropdown
                            isPrimary={false}
                            isLabelStyled={true}
                            label={<><BsThreeDots /></>}
                            items={[
                                <label key={`updateListModal${list.id}`} htmlFor={"updateListModal"} className="" onClick={() => showUpdateModal()}>
                                    <AiFillEdit /> Edit
                                </label>,
                                <label key={`deleteListModal${list.id}`} htmlFor={`deleteListModal`} className="" onClick={() => showDeleteModal()}>
                                    <AiFillDelete /> Delete
                                </label>
                            ]}
                        />
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
                                                return <TaskContainer key={task.id} task={task} index={index} isTaskLoading={isTaskLoading} setCurrentTask={setCurrentTask} />
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
    </>)
}

export default ListContainer;