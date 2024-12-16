import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import airbnbImage from "../assets/airbnb.webp";
import customerImage from "../assets/customer.webp";
import ownerImage from "../assets/owner.webp";
import { Box, Button } from "@mui/material";

const cardData = [
    {
        id: 1,
        title: "Airbnb",
        image: airbnbImage,
        backText: "Explore our customer services!",
        route: "/airbnb-form",
    },
    {
        id: 2,
        title: "Customer",
        image: customerImage,
        backText: "Browse property listings easily!",
        route: "/customer-form",
    },
    {
        id: 3,
        title: "Hotel Owner",
        image: ownerImage,
        backText: "Discover Airbnb options here!",
        route: "/hotel-owner-form",
    },
];

const Selection = () => {
    const navigate = useNavigate();

    const handleRedirect = (route) => {
        navigate(route);
    };

    return (
        <>
            <Layout>
                <div className="selection-container">
                    <h1 className="selection-heading">Data Ingestion(Step 4)</h1>
                    <div className="cards-container">
                        {cardData.map((card) => (
                            <div key={card.id} className="card">
                                <div className="card-inner">
                                    {/* Card Front */}
                                    <div className="card-front">
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="card-image"
                                        />
                                        <span className="card-text">{card.title}</span>
                                    </div>

                                    {/* Card Back */}
                                    <div className="card-back">
                                        <p className="card-back-text">{card.backText}</p>
                                        <button
                                            className="proceed-button"
                                            onClick={() => handleRedirect(card.route)}
                                        >
                                            Proceed as {card.title}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Box sx={{ marginTop: 4, display: "flex", marginLeft: "5%" }}>
                    <Button variant="contained" color="primary" onClick={() => navigate("/fetch-unique-value")}>
                        Back
                    </Button>
                </Box>
                <br />
                <br />
            </Layout>

            <style>
                {`
                /* General styles */
                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: 'Arial', sans-serif;
                    height: 100%; /* Ensure no scroll */
                    overflow: hidden;
                }

                .selection-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 0;
                    box-sizing: border-box;
                }

                .selection-heading {
                    font-size: 3rem;
                    margin-bottom: 2rem;
                    color: #333;
                }

                /* Cards Container */
                .cards-container {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 1200px;
                }

                /* Card */
                .card {
                    position: relative;
                    width: 30%; /* Responsive width */
                    height: 400px; /* Fixed height */
                    perspective: 1000px;
                    border-radius: 12px;
                }

                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.8s;
                }

                .card:hover .card-inner {
                    transform: rotateY(180deg);
                }

                .card-front, .card-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    text-align: center;
                }

                /* Card Front */
                .card-front {
                    background: #fff;
                }

                .card-image {
                    width: 100%;
                    height: auto;
                    object-fit: contain;
                }

                .card-text {
                    font-size: 1.5rem;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                    font-weight: bold;
                    color: #333;
                }

                /* Card Back */
                .card-back {
                    background: linear-gradient(to bottom, #6c63ff, #6b7280);
                    transform: rotateY(180deg);
                    color: #fff;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .card-back-text {
                    font-size: 1.2rem;
                    line-height: 1.5;
                    margin-bottom: 1rem;
                }

                /* Proceed Button */
                .proceed-button {
                    background-color: #fff;
                    color: #6c63ff;
                    border: 2px solid #fff;
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .proceed-button:hover {
                    background-color: #6c63ff;
                    color: #fff;
                }
                `}
            </style>
        </>
    );
};

export default Selection;
