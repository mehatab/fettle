import { FunctionComponent } from "react"
import Log from "../../types/Log"
import LogDaySummary from "../../types/LogDaySummary"

interface ServiceLogProps {
    item: LogDaySummary,
    show: boolean
}

const StatusView: FunctionComponent<ServiceLogProps> = ({ item, show }) => {
    return (
        <>
            {
                show &&
                <div className="absolute card mt-10 pl-5 pr-5">
                    <p>Date: {item.date}</p>
                    <p>Status: {item.status}</p>
                </div>
            }
        </>
    )
}

export default StatusView;