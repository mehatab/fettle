import { useState, useEffect } from "react";
import { Status } from "../../utils/constants";
import Service from "../types/Service";
import ServiceStatus from "../types/ServiceStatus";
import SystemStatus from "../types/SystemStatus";

function useSystemStatus(services: Service[] | null) {
    const [systemStatus, setSystemStatus] = useState<SystemStatus>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        if (services === null) {
            setIsLoading(true);
            return;
        }

        try {
            const statuses: ServiceStatus[] = services.map((service) => {
                const { name, status, logs } = service;

                const lastLog = logs.length > 0
                    ? logs[logs.length - 1]
                    : null;

                const date = lastLog?.date;

                return { name, status, date };
            });

            if (statuses.every((item) => item.status === Status.OPERATIONAL)) {
                setSystemStatus({
                    title: "All Systems Operational",
                    status: Status.OPERATIONAL,
                    datetime: statuses[0].date
                });
            } else if (statuses.every((item) => item.status === Status.OUTAGE)) {
                setSystemStatus({
                    title: "Outage",
                    status: Status.OUTAGE,
                    datetime: statuses[0].date
                    });
            } else if (statuses.every((item) => item.status === Status.UNKNOWN)) {
                setSystemStatus({
                    title: "Unknown",
                    status: Status.UNKNOWN,
                    datetime: statuses[0].date
                });
            } else {
                setSystemStatus({
                    title: "Partial Outage",
                    status: Status.PARTIAL_OUTAGE,
                    datetime: statuses[0].date
                });
            }
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }, [services]);

    return {systemStatus, isLoading, error};
}

export default useSystemStatus;
