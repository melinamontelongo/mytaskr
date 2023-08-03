"use client"
import { BiImage } from "react-icons/bi";
import Modal from "../ui/Modal";
import BoardChooseImage from "./BoardChooseImage";

interface BoardImageBtnModal {
    selectImageAction: Function,
}

const BoardImageBtnModal = ({ selectImageAction }: BoardImageBtnModal) => {
    return (<>
        <label htmlFor={"boardImage"} className="btn bg-base-300 normal-case w-full border-none flex items-center justify-center rounded">
            <BiImage className="text-base-content text-xl" /> Choose background
        </label>

        <Modal
            id={"boardImage"}
            body={<>
                <div className="text-center mb-2">
                    <h3 className="font-bold text-2xl">Select background image</h3>
                </div>
                <BoardChooseImage selectImageAction={selectImageAction} />
            </>}
        />
    </>)
}

export default BoardImageBtnModal;