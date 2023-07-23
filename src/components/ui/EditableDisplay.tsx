"use client"
import { ReactNode, useState } from "react";

interface EditableDisplay {
    displayElement: ReactNode,
    editElement: ReactNode,
}
const EditableDisplay = ({ displayElement, editElement }: EditableDisplay) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)

    return isEditing ? editElement : (
        <span onClick={() => setIsEditing(!isEditing)}>{displayElement}</span>
    )
}

export default EditableDisplay;