import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Layout from '../layout/Layout';
import {
    Select, MenuItem, TextField, Typography, Box, Paper, Grid, Container, Button
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchUniqueValues } from "../slice/uniqueUpdateValuesSlice";
import { BASE_URL } from './Constant';
import { useNavigate } from 'react-router-dom';

const Prediction = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [warning, setWarning] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const uniqueValues = useSelector((state) => state.uniqueUpdateValues.uniqueValues);
    const mergedData = useSelector((state) => state.mergedData.data);

    const features = [
        'name', 'minimum_nights', 'maximum_nights', 'number_of_reviews',
        'review_scores_rating', 'room_type_id', 'cancellation_policy_id',
        'year', 'day_of_week', 'available', 'instant_bookable',
    ];

    const [formData, setFormData] = useState(
        features.reduce((acc, feature) => ({ ...acc, [feature]: "" }), {})
    );

    const [nameSelected, setNameSelected] = useState(false);

    // Generate years for dropdown
    const futureYears = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);

    useEffect(() => {
        dispatch(fetchUniqueValues());
        const timer = setTimeout(() => setShowLoader(false), 3000);
        return () => clearTimeout(timer);
    }, [dispatch]);

    useEffect(() => {
        if (formData.name) {
            const filteredRecord = mergedData?.find((item) => item.name === formData.name);

            if (filteredRecord) {
                setFormData((prevData) => ({ ...prevData, ...filteredRecord }));
                setNameSelected(true);
                setWarning("");
            } else {
                setWarning("No data found for the selected name.");
                setNameSelected(false);
                setFormData((prevData) => features.reduce((acc, field) => {
                    acc[field] = field === 'name' ? prevData.name : "";
                    return acc;
                }, {}));
            }
        }
    }, [formData.name, mergedData]);

    const handleInputChange = (feature, value) => {
        setFormData((prevData) => ({ ...prevData, [feature]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/predict_rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            alert(result.message || "Prediction Submitted Successfully!");
        } catch (err) {
            alert("Failed to submit the prediction.");
        }
    };

    return (
        <Layout>
            {showLoader ? <Loader /> : (
                <Container maxWidth="lg">
                    <Paper elevation={4} sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
                        <Typography variant="h5" align="center" sx={{ mb: 2, color: '#3f51b5', fontWeight: 'bold' }}>
                            Future Room Price Prediction
                        </Typography>
                        <Grid container spacing={2}>
                            {/* NAME Field */}
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>NAME</Typography>
                                <Select
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {uniqueValues?.name?.map((value, index) => (
                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* YEAR Field */}
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>YEAR</Typography>
                                <Select
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    disabled={!nameSelected} // Disable until name is selected
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {futureYears.map((year, index) => (
                                        <MenuItem key={index} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* DAY OF WEEK Field */}
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>DAY OF WEEK</Typography>
                                <Select
                                    value={formData.day_of_week}
                                    onChange={(e) => handleInputChange('day_of_week', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    disabled={!nameSelected} // Disable until name is selected
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                                        <MenuItem key={index} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* Other Fields: Disabled */}
                            {features.filter((f) => !['name', 'year', 'day_of_week'].includes(f)).map((feature) => (
                                <Grid item xs={12} sm={6} key={feature}>
                                    <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>
                                        {feature.replace(/_/g, ' ').toUpperCase()}
                                    </Typography>
                                    <TextField
                                        value={formData[feature] || ""}
                                        disabled
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {warning && <Typography color="error" align="center" sx={{ mt: 2 }}>{warning}</Typography>}

                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={!nameSelected} // Disable until name is selected
                            >
                                Submit
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            )}

            <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => navigate("/new-merged-data")}>
                    Back
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("/")}>
                    Next
                </Button>
            </Box>
            <br />
            <br />
        </Layout>
    );
};

export default Prediction;
