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
                <div className="absolute card ml-1 mt-8 p-2 text-sm">
                    <p>{item.date} &mdash; {item.status}</p>
                </div>
            }
        </>
    )
}

export default StatusView;