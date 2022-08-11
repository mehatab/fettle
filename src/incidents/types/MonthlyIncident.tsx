import Incident from "./Incident";

interface MonthlyIncident {
    month: string;
    incidents?: Incident[];
}

export default MonthlyIncident;