import { Statuses } from "../../utils/constants";
import LogDaySummary from "./LogDaySummary";

interface Service {
    id: number;
    name: string;
    status: Statuses;
    logs: LogDaySummary[];
}

export default Service;