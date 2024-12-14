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

    useEffect(() => {
        if (Object.keys(data).length === 0 && !loading) {
            dispatch(fetchUniqueValues());
        }
    }, [dispatch, data, loading]);

    useEffect(() => {
        const initialSelection = Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
        setSelectedValues(initialSelection);

        const initialSearch = Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
        setSearchQueries(initialSearch);
    }, [data]);

    const handleSelectChange = (key) => (event) => {
        setSelectedValues((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleSearchChange = (key) => (event) => {
        const value = event.target.value;
        setSearchQueries((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const renderDropdowns = useMemo(() => {
        const keys = Object.entries(data);
        const middleIndex = Math.ceil(keys.length / 2);
        const leftSection = keys.slice(0, middleIndex);
        const rightSection = keys.slice(middleIndex);

        const renderSection = (section) =>
            section.map(([key, values], index) => (
                <Box
                    key={index}
                    sx={{
                        marginBottom: 3,
                        width: "100%",
                        paddingRight: "16px",
                    }}
                >
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
                                    style: {
                                        maxHeight: 300,
                                        overflowY: "auto",
                                        borderRadius: "8px",
                                    },
                                },
                            }}
                            renderValue={(selected) =>
                                selected ? selected : `Select ${key}`
                            }
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "8px",
                                fontSize: "14px",
                                "& .MuiSelect-select": {
                                    padding: "6px 8px",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: "#f1f1f1",
                                    marginBottom: "5px",
                                }}
                            >
                                <InputBase
                                    placeholder={`Search ${key}`}
                                    value={searchQueries[key] || ""}
                                    onChange={handleSearchChange(key)}
                                    sx={{
                                        width: "100%",
                                        padding: "8px",
                                        fontSize: "14px",
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
                                    <MenuItem
                                        key={idx}
                                        value={value}
                                        sx={{
                                            fontSize: "14px",
                                            "&:hover": {
                                                backgroundColor: "#e0f7fa",
                                            },
                                        }}
                                    >
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
                <Grid item xs={12} sm={6} sx={{ paddingRight: "16px" }}>
                    {renderSection(rightSection)}
                </Grid>
            </Grid>
        );
    }, [data, selectedValues, searchQueries]);

    return (
        <Layout>
            {loading ? (
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
                <Box
                    sx={{
                        paddingY: 2,
                        paddingX: 2,
                        width: "95%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "0 auto",
                    }}
                >
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{ fontWeight: "bold", marginBottom: 2 }}
                    >
                        Unique Values Selection
                    </Typography>

                    <Card
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            padding: 3,
                            width: "100%",
                        }}
                    >
                        {error ? (
                            <Typography align="center" color="error">
                                {error}
                            </Typography>
                        ) : Object.keys(data).length ? (
                            <Box sx={{ maxHeight: "80vh", overflowY: "auto", width: "100%" }}>
                                {renderDropdowns}
                            </Box>
                        ) : (
                            <Typography align="center">No data available.</Typography>
                        )}
                    </Card>
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
