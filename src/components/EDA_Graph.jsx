import React, { useState } from "react";
import { Bar, Pie, Line, Scatter, Bubble } from "react-chartjs-2";
import Layout from "../layout/Layout";
import { useSelector } from "react-redux";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import {
    Box,
    Modal,
    Typography,
    Button,
    Grid,
    Card,
    Container,
    CardContent,
    CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
);

const EDA_Graph = () => {
    const [selectedGraph, setSelectedGraph] = useState(null); // For modal
    const mergedData = useSelector((state) => state.mergedData.data).slice(0, 10);
    const navigate = useNavigate();
    if (!mergedData || mergedData.length === 0) {
        return (
            <Layout>
                <Box sx={{ textAlign: "center", marginTop: 4 }}>
                    <Typography variant="h5">No Data Available</Typography>
                </Box>
            </Layout>
        );
    }

    // Prepare Data for Graphs
    const neighborhoods = mergedData.map((item) => item.neighbourhood);
    const roomTypes = mergedData.map((item) => item.room_type);
    const prices = mergedData.map((item) => parseFloat(item.price));
    const reviews = mergedData.map((item) => parseInt(item.review_scores_rating));
    const availability = mergedData.map((item) => parseInt(item.available));

    const barChartData = {
        labels: [...new Set(neighborhoods)],
        datasets: [
            {
                label: "Listings Per Neighborhood",
                data: [...new Set(neighborhoods)].map(
                    (n) => mergedData.filter((item) => item.neighbourhood === n).length
                ),
                backgroundColor: "rgba(75,192,192,0.6)",
            },
        ],
    };

    const pieChartData = {
        labels: [...new Set(roomTypes)],
        datasets: [
            {
                data: [...new Set(roomTypes)].map(
                    (r) => mergedData.filter((item) => item.room_type === r).length
                ),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    const lineChartData = {
        labels: availability,
        datasets: [
            {
                label: "Availability Over Time",
                data: availability,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
            },
        ],
    };

    const scatterChartData = {
        datasets: [
            {
                label: "Price vs. Review Scores",
                data: mergedData.map((item) => ({
                    x: parseFloat(item.price),
                    y: parseInt(item.review_scores_rating),
                })),
                backgroundColor: "rgba(255,99,132,0.6)",
            },
        ],
    };

    const bubbleChartData = {
        datasets: [
            {
                label: "Listings Bubble Chart",
                data: mergedData.map((item) => ({
                    x: parseFloat(item.latitude),
                    y: parseFloat(item.longitude),
                    r: parseInt(item.review_scores_rating) / 10 || 5,
                })),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: true },
        },
    };

    const graphs = [
        {
            title: "Listings Per Neighborhood",
            component: <Bar data={barChartData} options={chartOptions} />,
        },
        {
            title: "Room Type Distribution",
            component: <Pie data={pieChartData} options={chartOptions} />,
        },
        {
            title: "Price vs. Review Scores",
            component: <Scatter data={scatterChartData} options={chartOptions} />,
        },
        {
            title: "Availability Over Time",
            component: <Line data={lineChartData} options={chartOptions} />,
        },
        {
            title: "Listings Bubble Chart",
            component: <Bubble data={bubbleChartData} options={chartOptions} />,
        },
    ];

    const handleOpenModal = (graph) => setSelectedGraph(graph);
    const handleCloseModal = () => setSelectedGraph(null);

    return (
        <Layout>
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold", marginBottom: 4 }}
                >
                    Exploratory Data Analysis (EDA)
                </Typography>

                {/* Graphs Grid */}
                <Grid container spacing={3}>
                    {graphs.map((graph, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    border: "1px solid #ddd",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontSize: "1rem", textAlign: "center", marginBottom: 2 }}
                                    >
                                        {graph.title}
                                    </Typography>
                                    <div
                                        style={{
                                            height: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {graph.component}
                                    </div>
                                </CardContent>
                                <CardActions
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        padding: 1,
                                    }}
                                >
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(graph)}
                                    >
                                        Expand
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Modal */}
                <Modal open={!!selectedGraph} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "50vw", // Reduced width
                            maxHeight: "70vh", // Reduced max height
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {selectedGraph && (
                            <>
                                {/* Graph Title */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: "bold",
                                        marginBottom: 2,
                                        textAlign: "center",
                                    }}
                                >
                                    {selectedGraph.title}
                                </Typography>

                                {/* Reduced Graph Container */}
                                <Box
                                    sx={{
                                        width: "90%", // Adjust width
                                        height: "300px", // Decrease graph height
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 2,
                                        border: "1px solid #ddd",
                                        borderRadius: 1,
                                        padding: 2,
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    {selectedGraph.component}
                                </Box>

                                {/* Action Buttons */}
                                <Box textAlign="center" sx={{ marginTop: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginRight: 2 }}
                                        onClick={() => {
                                            const link = document.createElement("a");
                                            link.href = selectedGraph.component.props.data; // Adjust if graph needs conversion
                                            link.download = `${selectedGraph.title}.png`;
                                            link.click();
                                        }}
                                    >
                                        Download
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>

                <Box marginTop={4} display="flex" justifyContent="space-between"  >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("merged-data")}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate("/fetch-unique-value")}
                    >
                        Next
                    </Button>
                </Box>
                <br/>
                <br/>

            </Container>
        </Layout>
    );
};

export default EDA_Graph;
