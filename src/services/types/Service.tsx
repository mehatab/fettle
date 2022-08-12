import LogDaySummary from "./LogDaySummary";

interface Service {
    id: number;
    name: string;
    status: string;
    logs: LogDaySummary[];
}

export default Service;