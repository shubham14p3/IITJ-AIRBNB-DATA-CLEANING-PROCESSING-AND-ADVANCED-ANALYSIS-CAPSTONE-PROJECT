import { useState, useEffect } from 'react';
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

    const dayToNumber = {
        "Sunday": 6,
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
    };

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
        // Prepare payload
        const payload = {
            latitude: parseFloat(formData.latitude || 0),
            longitude: parseFloat(formData.longitude || 0),
            minimum_nights: parseInt(formData.minimum_nights || 0, 10),
            maximum_nights: parseInt(formData.maximum_nights || 0, 10),
            number_of_reviews: parseInt(formData.number_of_reviews || 0, 10),
            review_scores_rating: parseInt(formData.review_scores_rating || 0, 10),
            room_type_id: parseInt(formData.room_type_id || 0, 10),
            cancellation_policy_id: parseInt(formData.cancellation_policy_id || 0, 10),
            year: parseInt(formData.year || 0, 10),
            day_of_week: dayToNumber[formData.day_of_week] || 0,
        };
        localStorage.setItem('form-data', JSON.stringify(formData));

        // Convert payload to query string
        const queryString = new URLSearchParams(payload).toString();
        try {
            const response = await fetch(`${BASE_URL}/api/predict-final?${queryString}`, {
                method: "GET", // Use GET to send data via query parameters
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch prediction.");
            }

            const result = await response.json();

            // Store the predicted_price in local storage
            localStorage.setItem('predicted_price', result.predicted_price);

            // Navigate to the final result page
            navigate("/final-result");
        } catch (err) {
            console.error("Error during fetch:", err);
            alert(err.message || "Failed to fetch the prediction.");
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
                                <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>NAME *</Typography>
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
                                <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>YEAR *</Typography>
                                <Select
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    disabled={!nameSelected}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {futureYears.map((year, index) => (
                                        <MenuItem key={index} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* DAY OF WEEK Field */}
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>DAY OF WEEK *</Typography>
                                <Select
                                    value={formData.day_of_week}
                                    onChange={(e) => handleInputChange('day_of_week', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    disabled={!nameSelected}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {Object.keys(dayToNumber).map((day, index) => (
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
                                disabled={!nameSelected || !formData.year || !formData.day_of_week}
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
                <Button variant="contained" color="secondary" onClick={() => navigate("/final-result")}>
                    Next
                </Button>
            </Box>
            <br />
            <br />
        </Layout>
    );
};

export default Prediction;
