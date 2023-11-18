interface Log {
    id: string;
    response_time: string | null;
    status: "failed" | "success" | "";
    created_at: string;
}

export default Log;