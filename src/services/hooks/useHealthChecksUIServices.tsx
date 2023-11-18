import { useState, useEffect } from "react";
import Service from '../types/Service';
import Log from "../types/Log";
import LogDaySummary from "../types/LogDaySummary";
import { DAYS_BACK, Status, Statuses } from "../../utils/constants";
import { sortByProp } from "../../utils/sortByProp";
import { ExecutionHistory, HealthChecksUILiveness, HealthChecksUIStatus } from "../types/HealthChecksUI";

type LogSummary = {
    date: string, 
    logs: Log[],
};

type LogsPerDay = { [key: string]: LogSummary };

function useHealthChecksUIServices(apiUrl: string) {
    const [services, setServices] = useState<Service[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(apiUrl);
                const raw = await response.json() as HealthChecksUILiveness[];

                const sorted = sortByProp(raw, "name");
                const sections = sorted;

                const services: Service[] = []
                for (let ii = 0; ii < sections.length; ii++) {
                    const section = sections[ii];
                    const { id, name } = section;

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
                setServices(services);
            } catch (e: any) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return { services, isLoading, error };
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

    const statusMap : {[x in HealthChecksUIStatus]: "failed" | "success" | "" }  = {
        'Unhealthy': 'failed',
        'Degraded': '',
        'Healthy': 'success',
    };

    const sorted = sortByProp(history, "id");

    sorted.forEach((execution: ExecutionHistory) => {
        const { id, name, status, on } = execution;

        // If the execution is older than DAYS_BACK, skip it
        // const executionDate = new Date(on);
        // const today = new Date();

        // const daysBack = daysDifference(today, executionDate);

        // if (daysBack > DAYS_BACK) {
        //     return;
        // }

        const response_time = null; // TODO: HealthChecksUI does not provide response time on per execution level
        logs.push({ id: `${id}`, response_time, status: statusMap[status], created_at: on })
    })

    if (logs.length === 0 && lastStatus) {
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
                const logsForDayBefore = summaryForDayBefore.logs;

                const lastLog = logsForDayBefore.length > 0
                    ? logsForDayBefore[logsForDayBefore.length - 1]
                    : null;

                const logs = lastLog && lastLog.status === "success"
                    ? [lastLog]
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

        let status: Statuses;

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

    const daysBack = daysDifference(today, olderDate);

    return daysBack;
}

function daysDifference(a: Date, b: Date) {
    const diffTime = Math.abs(b.getTime() - a.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    return diffDays;
}

function dateBeforeRelativeTo(relativeTo: Date, days: number) {
    const day = new Date(relativeTo.getFullYear(), relativeTo.getMonth(), relativeTo.getDate() - days);

    return day;
}

export default useHealthChecksUIServices;
