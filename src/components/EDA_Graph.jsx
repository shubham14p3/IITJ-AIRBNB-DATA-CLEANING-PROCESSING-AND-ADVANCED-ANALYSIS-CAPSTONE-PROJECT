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
    const mergedData = useSelector((state) => state.mergedData.data).slice(0, 500);
    const navigate = useNavigate();

    if (!mergedData || mergedData.length === 0) {
        return (
            <Layout>
                <Box sx={{ textAlign: "center", marginTop: 4 }}>
                    <Typography variant="h5">No Data Available</Typography>
                </Box>
                <Box marginTop={4} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/merged-data")}
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
            </Layout>
        );
    }

    // Prepare Data for Graphs
    const neighborhoods = mergedData.map((item) => item.neighbourhood);
    const roomTypes = mergedData.map((item) => item.room_type);
    const prices = mergedData.map((item) => parseFloat(item.price));
    const reviews = mergedData.map((item) => parseInt(item.review_scores_rating));
    const availability = mergedData.map((item) => parseInt(item.available));

    // Bar Chart: Listings Per Neighborhood
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

    // Pie Chart: Room Type Distribution
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

    // Line Chart: Availability Over Time
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

    // Scatter Plot: Price vs. Review Scores
    const scatterChartData = {
        datasets: [
            {
                label: "Price vs. Review Scores",
                data: mergedData.map((item) => ({
                    x: parseFloat(item.price),
                    y: parseInt(item.review_scores_rating || 0),
                })),
                backgroundColor: "rgba(255,99,132,0.6)",
            },
        ],
    };

    // Bubble Chart: Geographical Distribution
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

    // Pie Chart: Cancellation Policies Distribution
    const cancellationChartData = {
        labels: ["Flexible", "Moderate", "Strict"],
        datasets: [
            {
                data: [
                    mergedData.filter((item) => item.cancellation_policy_id === "0")
                        .length,
                    mergedData.filter((item) => item.cancellation_policy_id === "1")
                        .length,
                    mergedData.filter((item) => item.cancellation_policy_id === "2")
                        .length,
                ],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    // Bar Chart: Number of Reviews Distribution
    const reviewsChartData = {
        labels: ["0-50", "51-100", "101-150", "151+"],
        datasets: [
            {
                label: "Number of Reviews",
                data: [
                    mergedData.filter((item) => item.number_of_reviews <= 50).length,
                    mergedData.filter(
                        (item) =>
                            item.number_of_reviews > 50 && item.number_of_reviews <= 100
                    ).length,
                    mergedData.filter(
                        (item) =>
                            item.number_of_reviews > 100 && item.number_of_reviews <= 150
                    ).length,
                    mergedData.filter((item) => item.number_of_reviews > 150).length,
                ],
                backgroundColor: "rgba(75,192,192,0.6)",
            },
        ],
    };

    // Bar Chart: Price Distribution
    const priceDistributionChartData = {
        labels: ["0-50", "51-100", "101-150", "151+"],
        datasets: [
            {
                label: "Price Distribution",
                data: [
                    mergedData.filter((item) => item.price <= 50).length,
                    mergedData.filter((item) => item.price > 50 && item.price <= 100)
                        .length,
                    mergedData.filter((item) => item.price > 100 && item.price <= 150)
                        .length,
                    mergedData.filter((item) => item.price > 150).length,
                ],
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
        ],
    };

    // Top Hosts by Reviews
    const topHostsByReviewsData = {
        labels: [...new Set(mergedData.map((item) => item.host_name))].slice(0, 10),
        datasets: [
            {
                label: "Top Hosts by Reviews",
                data: [...new Set(mergedData.map((item) => item.host_name))]
                    .map((host) =>
                        mergedData
                            .filter((item) => item.host_name === host)
                            .reduce(
                                (sum, item) => sum + parseInt(item.number_of_reviews || 0),
                                0
                            )
                    )
                    .slice(0, 10),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    // Chart Options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
        },
    };

    // Graphs Array
    const graphs = [
        {
            title: "Listings Per Neighborhood",
            description: [
                "This bar chart shows the count of listings per neighborhood.",
                "Helps identify the most popular neighborhoods.",
                "Neighborhood names are aggregated for clarity.",
                "Useful for analyzing the concentration of properties.",
            ],
            component: <Bar data={barChartData} options={chartOptions} />,
        },
        {
            title: "Room Type Distribution",
            description: [
                "This pie chart shows the proportion of different room types.",
                "Room types include Entire Home, Private Room, and Shared Room.",
                "Useful for understanding the accommodation type distribution.",
                "Helps analyze guest preferences.",
            ],
            component: <Pie data={pieChartData} options={chartOptions} />,
        },
        {
            title: "Price vs. Review Scores",
            description: [
                "This scatter plot compares the price of a listing against its review scores.",
                "X-axis: Price, Y-axis: Review Scores.",
                "Helps analyze the relationship between pricing and customer satisfaction.",
                "Useful for performance and pricing analysis.",
            ],
            component: <Scatter data={scatterChartData} options={chartOptions} />,
        },
        {
            title: "Availability Over Time",
            description: [
                "This line chart shows the availability of listings over time.",
                "X-axis: Availability (days), Y-axis: Count of listings.",
                "Helps identify patterns and trends in booking availability.",
                "Useful for seasonal analysis.",
            ],
            component: <Line data={lineChartData} options={chartOptions} />,
        },
        {
            title: "Listings Bubble Chart",
            description: [
                "This chart maps the geographical distribution of listings.",
                "X-axis: Latitude, Y-axis: Longitude.",
                "Bubble size corresponds to review scores.",
                "Helps identify clustering of listings.",
            ],
            component: <Bubble data={bubbleChartData} options={chartOptions} />,
        },
        {
            title: "Cancellation Policies Distribution",
            description: [
                "This pie chart shows the proportion of cancellation policies.",
                "Policies include Flexible, Moderate, and Strict.",
                "Helps analyze flexibility offered by hosts.",
                "Useful for understanding host preferences.",
            ],
            component: <Pie data={cancellationChartData} options={chartOptions} />,
        },
        {
            title: "Number of Reviews Distribution",
            description: [
                "This bar chart shows the frequency of review counts.",
                "X-axis: Review count buckets (e.g., 0-50, 51-100).",
                "Y-axis: Count of listings in each range.",
                "Helps identify highly reviewed properties.",
            ],
            component: <Bar data={reviewsChartData} options={chartOptions} />,
        },
        {
            title: "Price Distribution",
            description: [
                "This histogram shows the distribution of prices.",
                "X-axis: Price ranges (e.g., 0-50, 51-100).",
                "Y-axis: Count of listings in each range.",
                "Helps identify common pricing trends.",
            ],
            component: (
                <Bar data={priceDistributionChartData} options={chartOptions} />
            ),
        },

        {
            title: "Top Hosts by Review Count",
            description: ["Bar chart showing hosts with the most reviews."],
            component: <Bar data={topHostsByReviewsData} options={chartOptions} />,
        },
    ];

    // Modal Handlers
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
                                        sx={{
                                            fontSize: "1rem",
                                            textAlign: "center",
                                            marginBottom: 2,
                                        }}
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
                                        {graph.component}{" "}
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
                                    sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
                                >
                                    {selectedGraph.title}
                                </Typography>

                                {/* Graph Description */}
                                <Box sx={{ marginBottom: 2 }}>
                                    {selectedGraph.description.map((point, index) => (
                                        <Typography key={index} sx={{ fontSize: "0.9rem", mb: 1 }}>
                                            • {point}
                                        </Typography>
                                    ))}
                                </Box>

                                {/* Graph */}
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "350px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        marginBottom: 2,
                                    }}
                                >
                                    {selectedGraph.component}
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ textAlign: "center" }}>
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
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>

                <Box marginTop={4} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/merged-data")}
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
                <br />
                <br />
            </Container>
        </Layout>
    );
};

export default EDA_Graph;
