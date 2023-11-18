import { useState, useEffect } from "react";
import Service from '../types/Service';
import Log from "../types/Log";
import LogDaySummary from "../types/LogDaySummary";
import { DAYS_BACK, Status } from "../../utils/constants";
import { sortByProp } from "../../utils/sortByProp";
import { ExecutionHistory, HealthChecksUILiveness, HealthChecksUIStatus } from "../types/HealthChecksUI";

type LogSummary = {
    date: string, 
    logs: Log[],
};

type LogsPerDay = { [key: string]: LogSummary };

function useHealthChecksUIServices(apiUrl: string) {
    const [data, setData] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(apiUrl);
                const raw = await response.json() as HealthChecksUILiveness[];

                const sorted = sortByProp(raw, "name");
                const sections = [sorted[0], sorted[1]];

                const services: Service[] = []
                for (let ii = 0; ii < sections.length; ii++) {
                    const section = sections[ii];
                    const {
                        id,
                        name,
                        status,
                        uri,

                        onStateFrom,
                        lastExecuted,

                        entries,
                        history,
                    } = section;

                    if (!id || !name) {
                        continue;
                    }
                    const log = await logs(section);

                    if (log.length > 0) {
                        services.push({ id: ii, name: name, status: log[log.length - 1].status, logs: log })
                    } else {
                        services.push({ id: ii, name: name, status: Status.UNKNOWN, logs: log })
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

async function logs(section: HealthChecksUILiveness): Promise<LogDaySummary[]> {
    const { name, history } = section;

    const logs: Log[] = [];
    const logDaySummary: LogDaySummary[] = [];

    const statusMap : {[x in HealthChecksUIStatus]: string }  = {
        'Unhealthy': 'failed',
        'Degraded': '',
        'Healthy': 'success',
    };

    history.forEach((execution: ExecutionHistory) => {
        const { id, name, status, on } = execution;
        const response_time = null; // TODO: HealthChecksUI does not provide response time on per execution level
        logs.push({ id: `${id}`, response_time, status: statusMap[status], created_at: on })
    })

    const logsPerDay = logs.reduce((r: LogsPerDay, date) => {
        const [year, month, day] = date.created_at.substr(0, 10).split('-');
        const key = `${year}_${month}_${day}`;
        r[key] = r[key] || { date: date.created_at, logs: [] };
        r[key].logs.push(date);
        return r;
    }, {} as LogsPerDay);

    const prepareSummary = Object.values(logsPerDay);

    prepareSummary.forEach((logSummary) => {
        var avg_response_time = 0

        logSummary.logs.forEach((log) => {
            if (log.response_time) {
                avg_response_time += Number(log.response_time.replaceAll('s', ''));
            }
        });

        let status = ""
        if (logSummary.logs.length === 0) {
            status = Status.UNKNOWN
        } else if (logSummary.logs.every((item:any)=> item.status === 'success')) {
            status = Status.OPERATIONAL
        } else if (logSummary.logs.every((item:any)=> item.status === 'failed')) {
            status = Status.OUTAGE
        } else {
            status = Status.PARTIAL_OUTAGE
        }

        logDaySummary.push({
            avg_response_time: avg_response_time / logSummary.logs.length,
            current_status: logSummary.logs[logSummary.logs.length - 1].status,
            date: logSummary.date.substr(0, 10),
            status: status
        })
    })


    return fillData(logDaySummary);
}

function fillData(data: LogDaySummary[]): LogDaySummary[] {
    const logDaySummary: LogDaySummary[] = [];
    var today = new Date();

    for (var i = -1; i < DAYS_BACK - 1; i += 1) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const summary = data.find((item) => item.date === d.toISOString().substr(0, 10));
        logDaySummary.push({
            avg_response_time: summary?.avg_response_time || 0,
            current_status: summary?.current_status || Status.UNKNOWN,
            date: d.toISOString().substr(0, 10),
            status: summary?.status || Status.UNKNOWN
        })
    }

    return logDaySummary.reverse();
}


export default useHealthChecksUIServices;
