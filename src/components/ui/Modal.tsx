"use client"
import { ForwardedRef, ReactNode, forwardRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
    id: string,
    body: ReactNode,
    actionContent?: ReactNode,
}

const Modal = forwardRef(({ id, body, actionContent }: ModalProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <>
            <input ref={ref} type="checkbox" id={id} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-base-200">
                    <label htmlFor={id} aria-label="close" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><AiOutlineClose /></label>
                    <div className="mt-4">
                        {body}
                        {actionContent &&
                            <div className="modal-action">
                                {actionContent}
                            </div>}
                    </div>
                </div>
            </div>
        </>
    )
})

Modal.displayName = "Modal";

export default Modal;