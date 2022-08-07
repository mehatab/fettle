import { useState, useEffect } from "react";

function useRequest(url: string) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                let response = await fetch(url);
                let data = await response.json();
                setData(data);
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

export default useRequest;
