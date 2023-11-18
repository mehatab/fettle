interface Log {
    id: string;
    response_time: string | null;
    status: string; // TODO: failed | success
    created_at: string;
}

export default Log;