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
                const sections = sorted.filter(s => s.name === "SCMS Authentication API");

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
    const {
        name,
        history,

        onStateFrom: isoDateLastStatusChange,
        status: lastStatus,
    } = section;

    const logs: Log[] = [];
    const logDaySummary: LogDaySummary[] = [];

    const statusMap : {[x in HealthChecksUIStatus]: string }  = {
        'Unhealthy': 'failed',
        'Degraded': '',
        'Healthy': 'success',
    };

    const sorted = sortByProp(history, "id");

    sorted.forEach((execution: ExecutionHistory) => {
        const { id, name, status, on } = execution;
        const response_time = null; // TODO: HealthChecksUI does not provide response time on per execution level
        logs.push({ id: `${id}`, response_time, status: statusMap[status], created_at: on })
    })

    if (sorted.length === 0 && lastStatus) {
        // Include a synthetic entry based on the last state change
        const syntheticLog = {
            id: '0',
            response_time: null,
            status: statusMap[lastStatus],
            created_at: isoDateLastStatusChange
        };

        logs.push(syntheticLog);
    }

    const logsPerDayFromApi = logs.reduce((r: LogsPerDay, date) => {
        const key = isoDateToKey(date.created_at);
        const logSummary = { date: date.created_at, logs: [] };

        r[key] = r[key] || logSummary;
        r[key].logs.push(date);
        return r;
    }, {} as LogsPerDay);

    const logsPerDaySynthetic: LogsPerDay = {};
    
    const today = new Date();
    const daysBack = determineDaysBack(today, logs);

    for (let i = daysBack; i >= -1; i--) {
        const dayWithoutLogs = dateBeforeRelativeTo(today, i);
        const key = nativeDateToKey(dayWithoutLogs);

        if (!logsPerDayFromApi[key])
        {
            const dayBefore = dateBeforeRelativeTo(today, i + 1);
            const keyDayBefore = nativeDateToKey(dayBefore);

            const summaryForDayBefore = logsPerDayFromApi[keyDayBefore] || logsPerDaySynthetic[keyDayBefore];

            if (summaryForDayBefore) {
                const logs = summaryForDayBefore.logs.length > 0
                    ? [summaryForDayBefore.logs[summaryForDayBefore.logs.length - 1]]
                    : [];

                const created_at = dayWithoutLogs.toISOString();
                const syntheticLogSummary = { date: created_at, logs: logs };

                logsPerDaySynthetic[key] = syntheticLogSummary;
            }
        }
    }

    const logsPerDay = { ...logsPerDaySynthetic, ...logsPerDayFromApi };

    const prepareSummary = Object.values(logsPerDay);

    prepareSummary.forEach((logSummary) => {
        const { date, logs } = logSummary;
        const dateOnly = date.substr(0, 10);;

        var avg_response_time = 0

        logs.forEach((log) => {
            if (log.response_time) {
                avg_response_time += Number(log.response_time.replaceAll('s', ''));
            }
        });

        let status = ""
        if (logs.length === 0) {
            status = Status.UNKNOWN
        } else if (logs.every((item)=> item.status === 'success')) {
            status = Status.OPERATIONAL
        } else if (logs.every((item)=> item.status === 'failed')) {
            status = Status.OUTAGE
        } else {
            status = Status.PARTIAL_OUTAGE
        }

        const lastLog = logs.length === 0
            ? null
            : logs[logs.length - 1];

        logDaySummary.push({
            avg_response_time: logs.length === 0
                ? 0
                : avg_response_time / logs.length,

            current_status: lastLog
                ? lastLog.status
                : Status.UNKNOWN,

            date: dateOnly,
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

function isoDateToKey(isoDate: string) {
    const [year, month, day] = isoDate.substr(0, 10).split('-');
    const key = `${year}_${month}_${day}`;

    return key;
}

function nativeDateToKey(date: Date) {
    const isoDate = date.toISOString();
    const key = isoDateToKey(isoDate);

    return key;
}

function determineDaysBack(today: Date, logs: Log[]) {
    // If there are logs, use the oldest date, otherwise the day that is DAYS_BACK before today
    const olderDate = logs.length > 0
        ? new Date(logs[0].created_at)
        : new Date(today.getFullYear(), today.getMonth(), today.getDate() - DAYS_BACK);

    const daysBack = Math.ceil((today.getTime() - olderDate.getTime()) / (1000 * 3600 * 24));

    return daysBack;
}

function dateBeforeRelativeTo(relativeTo: Date, days: number) {
    const day = new Date(relativeTo.getFullYear(), relativeTo.getMonth(), relativeTo.getDate() - days);

    return day;
}

export default useHealthChecksUIServices;
