import Log from "./Log";

interface Service {
    id: number;
    name: string;
    status: string;
    logs: Log[];
}

export default Service;