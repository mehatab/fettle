import { useState, useEffect } from "react";
import Service from '../types/Service';
import Log from "../types/Log";

function useIncidents() {
    const [data, setData] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("./urls.cfg");
                const configText = await response.text();
                const configLines = configText.split("\n");
                const services: Service[] = []
                for (let ii = 0; ii < configLines.length; ii++) {
                    const configLine = configLines[ii];
                    const [key, url] = configLine.split("=");
                    if (!key || !url) {
                        continue;
                    }
                    const log = await logs(key);
                    if (log.length > 0) {
                        services.push({ id: ii, name: key, status: log[log.length - 1].status, logs: log })
                    } else {
                        services.push({ id: ii, name: key, status: "unknown", logs: log })
                    }
                }
                setData(services as Service[]);
            } catch (e: any) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return [data, isLoading, error];
}

async function logs(key: string): Promise<Log[]> {
    const response = await fetch(`./status/${key}_report.log`);
    const text = await response.text();
    const lines = text.split("\n");
    const logs: Log[] = [];

    for (let index = 89; index >= 0; index--) {
        if (lines.length > index) {
            const line = lines[index];
            const [created_at, status, response_time] = line.split(", ");
            logs.push({ response_time, status, created_at })
        } else {
            logs.push({ response_time: "0s", status: "not-started", created_at: "" })
        }
    }

    return logs;
}

export default useIncidents;
