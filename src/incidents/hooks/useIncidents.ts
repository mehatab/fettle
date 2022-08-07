import { useState, useEffect } from "react";
import Incidents from '../types/Incidents';

function useIncidents(url: string) {
    const [data, setData] = useState<Incidents[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                let response = await fetch(url);
                let data = await response.json();
                setData(data as Incidents[]);
            } catch (e: any) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [url]);

    return [data, isLoading, error];
}

export default useIncidents;
