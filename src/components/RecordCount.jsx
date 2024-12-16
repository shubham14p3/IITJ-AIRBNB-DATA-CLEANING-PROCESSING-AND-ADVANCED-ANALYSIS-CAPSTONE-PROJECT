import React, { useState, useEffect } from "react";
import { BASE_URL } from "./Constant";
const RecordCount = () => {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch the record count
        const fetchRecordCount = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/fetch-record-count`);

                if (response.ok) {
                    const data = await response.json();
                    if (data.status) {
                        setCount(data.data.count); // Set the record count

                    } else {
                        throw new Error(data.message || "Failed to fetch record count");
                    }
                } else {
                    throw new Error("Network response was not ok");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecordCount();
    }, []);

    // Render loading state, error, or count
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>Record Count: {count}</h3>
        </div>
    );
};

export default RecordCount;
