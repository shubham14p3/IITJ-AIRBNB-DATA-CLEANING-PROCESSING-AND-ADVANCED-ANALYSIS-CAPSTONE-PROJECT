import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";

const TrialPage = () => {
    const navigate = useNavigate();
    const steps = [
        { id: 1, title: "Filling in the data…", subtitle: "Preparing input for the model" },
        { id: 2, title: "Training the data…", subtitle: "Building and refining the model" },
        { id: 3, title: "Predicting the data…", subtitle: "Generating the final output" },
    ];
    const [currentStep, setCurrentStep] = useState(0);
    const [price, setPrice] = useState(0); // Holds the price from localStorage
    const [form, setForm] = useState({}); // Holds the price from localStorage
    const [name, setName] = useState(''); // Holds the price from localStorage
    const [day, setDay] = useState(); // Holds the price from localStorage
    const [year, setYear] = useState(); // Holds the price from localStorage
    const isCompleted = currentStep === steps.length;

    useEffect(() => {
        // Simulate loading steps
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
        }, 3000);
        return () => clearInterval(stepInterval);
    }, [steps.length]);

    useEffect(() => {
        // Fetch price from localStorage
        const storedPrice = localStorage.getItem("predicted_price");
        setPrice(storedPrice ? parseFloat(storedPrice) : 0);

        // Fetch form data from localStorage
        const defaultForm = JSON.parse(localStorage.getItem("form-data")) || {};
        setForm(defaultForm);

    }, []);

    // Log updated form data
    useEffect(() => {
        setName(form?.name);
        setDay(form?.day_of_week);
        setYear(form?.year);
    }, [form]);

    const handleRePredict = () => {
        navigate("/prediction");
    };

    const handleNextBI = () => {
        navigate("/power-bi");
    };

    return (
        <Layout>
            <div style={styles.container}>
                {isCompleted ? (
                    // Final Section
                    <div style={styles.finalContainer}>
                        <h1
                            style={{
                                fontSize: "1.8rem",
                                fontWeight: "bold",
                                color: "#fff",
                                textAlign: "center",
                                marginBottom: "10px",
                                lineHeight: "1.5",
                            }}
                        >
                            Here is the Predicted Price for
                        </h1>
                        <h1
                            style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                color: "#28a745",
                                textAlign: "center",
                                marginBottom: "20px",
                                lineHeight: "1.5",
                            }}
                        >
                            Hotel "{name}" on "{day}" for year "{year}" is
                        </h1>
                        <h2
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "bold",
                                color: "#007bff",
                                textAlign: "center",
                                marginTop: "10px",
                            }}
                        >
                            ${price.toFixed(2)}
                        </h2>


                        {/* Display Form Data */}
                        <div style={styles.formDataContainer}>
                            {/* <h3 style={styles.formDataTitle}>Form Data:</h3> */}
                            <div style={styles.gridContainer}>
                                {Object.entries(form).map(([key, value]) => (
                                    <div key={key} style={styles.gridItem}>
                                        <strong>{key.replace(/_/g, " ")}:</strong> {value}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div style={styles.buttonContainer}>
                            <button style={styles.button} onClick={handleRePredict}>
                                Re-predict
                            </button>
                            <span style={{ padding: "50px" }} />
                            <button style={{ ...styles.button, backgroundColor: "#28a745" }} onClick={handleNextBI}>
                                Next BI Graphs
                            </button>
                        </div>
                        <br/>
                        <br/>
                    </div>

                ) : (
                    // Loading Section
                    <div style={styles.loadingContainer}>
                        {/* Section 1 - Text Steps */}
                        <div style={styles.sectionOne}>
                            {steps.map((step, index) => (
                                <div key={step.id} style={styles.stepContainer}>
                                    <div style={styles.loaderContainer}>
                                        {index < currentStep ? (
                                            <span style={styles.tick}>&#10003;</span>
                                        ) : index === currentStep ? (
                                            <div style={styles.loader}></div>
                                        ) : (
                                            <div style={styles.circle}></div>
                                        )}
                                    </div>
                                    <div style={styles.textContainer}>
                                        <h4
                                            style={{
                                                ...styles.title,
                                                color: index <= currentStep ? "#fff" : "#555",
                                            }}
                                        >
                                            {index < currentStep
                                                ? step.title.replace("…", " is ready!")
                                                : step.title}
                                        </h4>
                                        <h5 style={styles.subtitle}>{step.subtitle}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 2 - GIF */}
                        <div style={styles.sectionTwo}>
                            <img src="src/assets/loader.gif" alt="Loading..." style={styles.gif} />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1e1e2e",
        fontFamily: "Arial, sans-serif",
        color: "#aaa",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
        maxWidth: "1200px",
    },
    sectionOne: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    sectionTwo: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    gif: {
        width: "90%",
        height: "90%",
    },
    stepContainer: {
        display: "flex",
        alignItems: "center",
        margin: "15px 0",
    },
    loaderContainer: {
        marginRight: "15px",
        minWidth: "30px",
        display: "flex",
        justifyContent: "flex-start",
    },
    loader: {
        width: "20px",
        height: "20px",
        border: "3px solid #555",
        borderTop: "3px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    tick: {
        color: "#28a745",
        fontSize: "1.5rem",
    },
    circle: {
        width: "20px",
        height: "20px",
        border: "2px solid #555",
        borderRadius: "50%",
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    title: {
        fontSize: "1.4rem",
        fontWeight: "bold",
        margin: "0",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#aaa",
        margin: "5px 0 0 0",
    },
    finalContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    finalText: {
        color: "#28a745",
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "10px",
    },
    priceText: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    buttonContainer: {
        display: "flex",
        gap: "20px",
        marginTop: "20px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background 0.3s ease",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
        gap: "15px",
        width: "80%",
        marginTop: "10px",
        justifyContent: "center", // Center horizontally
        alignItems: "center",
        marginLeft: "10%"
    },
    gridItem: {
        backgroundColor: "#3e3e4e",
        padding: "10px",
        borderRadius: "5px",
        color: "#fff",
        fontSize: "1rem",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        textAlign: "left",
        wordBreak: "break-word", // Ensure long text wraps
    },

};

// Add animation for loader
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
    `@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }`,
    styleSheet.cssRules.length
);

export default TrialPage;
