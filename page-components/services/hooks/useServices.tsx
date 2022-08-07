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
                    services.push({ id: ii, name: key, status: "unknown", logs: await logs(key) })
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
    for (let ii = 0; ii < lines.length; ii++) {
        const line = lines[ii];
        const [created_at, status, response_time] = line.split(", ");
        logs.push({ response_time, status, created_at })
    }

    return logs;
}

export default useIncidents;
