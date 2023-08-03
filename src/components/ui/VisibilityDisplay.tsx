import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi"

interface VisibilityDisplayProps {
    isPublic: boolean,
}
const VisibilityDisplay = ({ isPublic }: VisibilityDisplayProps) => {
    return (
        <div className="flex items-center">{isPublic ?
            <>
                <BiLockOpenAlt />
                <span className="text-xs">
                    Public
                </span>
            </>
            :
            <>
                <BiLockAlt />
                <span className="text-xs">
                    Private
                </span>
            </>
        }
        </div>
    )
}

export default VisibilityDisplay;