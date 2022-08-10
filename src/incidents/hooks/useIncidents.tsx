import { useState, useEffect } from "react";
import Incident from "../types/Incident";

function useIncidents() {
    const [data, setData] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("https://api.github.com/repos/mehatab/fettle/issues?per_page=2&state=all");
                const issues = await response.json();
                const incidents: Incident[] = [];
                issues.forEach((issue: any) => {
                    incidents.push({
                        id: issue.id,
                        title: issue.title,
                        desciption: issue.body,
                        status: issue.state,
                        created_at: issue.created_at,
                        closed_at: issue.closed_at,
                        labels: issue.labels.map((label: any) => label.name)
                    })
                });
                setData(incidents);
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


export default useIncidents;
