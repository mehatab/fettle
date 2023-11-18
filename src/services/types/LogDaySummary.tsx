import { Statuses } from "../../utils/constants";

interface LogDaySummary {
    avg_response_time: number;
    date: string;
    status: Statuses;
}

export default LogDaySummary;