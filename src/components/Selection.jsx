import React from "react";
import Layout from "../layout/Layout";
import airbnbImage from "../assets/airbnb.webp";
import customerImage from "../assets/customer.webp";
import ownerImage from "../assets/owner.webp";

const cardData = [
    {
        id: 1,
        title: "Airbnb",
        image: airbnbImage,
        backText: "Explore our customer services!",
    },
    {
        id: 2,
        title: "Customer",
        image: customerImage,
        backText: "Browse property listings easily!",
    },
    {
        id: 3,
        title: "Hotel Owner",
        image: ownerImage,
        backText: "Discover Airbnb options here!",
    },
];

const Selection = () => {
    return (
        <>
            <Layout>
                <div className="selection-container">
                    <h1 className="selection-heading">Make Your Selection</h1>
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
                }

                .card-back-text {
                    font-size: 1.2rem;
                    line-height: 1.5;
                }
                `}
            </style>
        </>
    );
};

export default Selection;
