import React, { useEffect, useMemo } from "react";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Card,
    Grid,
    InputBase,
    Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchUniqueValues } from "../slice/uniqueValuesSlice";
import Layout from "../layout/Layout";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

function FetchUniqueValue() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading, error } = useSelector((state) => state.uniqueValues);
    const [selectedValues, setSelectedValues] = React.useState({});
    const [searchQueries, setSearchQueries] = React.useState({});
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    useEffect(() => {
        if (Object.keys(data).length === 0) {
            dispatch(fetchUniqueValues());
        }
    }, [dispatch, data]);

    useEffect(() => {
        if (data && Object.keys(data).length) {
            const initialSelection = Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
            setSelectedValues(initialSelection);

            const initialSearch = Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
            setSearchQueries(initialSearch);
        }
    }, [data]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        dispatch(fetchUniqueValues()).finally(() => setIsRefreshing(false));
    };

    const handleSelectChange = (key) => (event) => {
        setSelectedValues((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleSearchChange = (key) => (event) => {
        setSearchQueries((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "unique-values.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderDropdowns = useMemo(() => {
        const keys = Object.entries(data);
        const middleIndex = Math.ceil(keys.length / 2);
        const leftSection = keys.slice(0, middleIndex);
        const rightSection = keys.slice(middleIndex);

        const renderSection = (section) =>
            section.map(([key, values], index) => (
                <Box key={index} sx={{ marginBottom: 3, width: "100%" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            value={selectedValues[key] || ""}
                            onChange={handleSelectChange(key)}
                            displayEmpty
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 300, overflowY: "auto" },
                                },
                            }}
                            renderValue={(selected) =>
                                selected ? selected : `Select ${key}`
                            }
                            sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
                        >
                            <Box sx={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                                <InputBase
                                    placeholder={`Search ${key}`}
                                    value={searchQueries[key] || ""}
                                    onChange={handleSearchChange(key)}
                                    sx={{
                                        width: "100%",
                                        padding: "4px 8px",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                    }}
                                />
                            </Box>
                            {values
                                .filter((value) =>
                                    value
                                        .toString()
                                        .toLowerCase()
                                        .includes((searchQueries[key] || "").toLowerCase())
                                )
                                .map((value, idx) => (
                                    <MenuItem key={idx} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>
            ));

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderSection(leftSection)}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderSection(rightSection)}
                </Grid>
            </Grid>
        );
    }, [data, selectedValues, searchQueries]);

    return (
        <Layout>
            {loading || isRefreshing ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <ClipLoader color="#4A90E2" size={50} />
                </Box>
            ) : (
                <Box sx={{ paddingY: 2, paddingX: 2, width: "95%", margin: "0 auto" }}>
                    <Typography variant="h6" align="center" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Unique Values Selection
                    </Typography>

                    <Card sx={{ backgroundColor: "#fff", borderRadius: "8px", padding: 3, width: "100%" }}>
                        {error ? (
                            <Typography align="center" color="error">
                                {error}
                            </Typography>
                        ) : Object.keys(data).length ? (
                            <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}>{renderDropdowns}</Box>
                        ) : (
                            <Typography align="center">No data available.</Typography>
                        )}
                    </Card>

                    <Box sx={{ marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" onClick={handleRefresh}>
                            Refresh
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDownload}>
                            Download JSON
                        </Button>
                    </Box>
                </Box>
            )}

            <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => navigate("/merged-data")}>
                    Back
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("/fetch-unique-value")}>
                    Next
                </Button>
            </Box>
            <br />
            <br />
        </Layout>
    );
}

export default FetchUniqueValue;
