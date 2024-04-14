import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {PageLayout} from "../components/PageLayout";

const DetailsPage = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/detail/${movieId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  return (
    <PageLayout>
      <div style={{ color: "white", textAlign: "center" }}>
        <h1 style={{ color: "white", textAlign: "center" }}>Movie Details</h1>
        {movieDetails ? (
          <div>
            <h2 style={{ color: "white", textAlign: "center" }}>{movieDetails.title}</h2>
            {movieDetails.originalTitle && (
              <h3 style={{ color: "white", textAlign: "center" }}>Original Title: {movieDetails.originalTitle}</h3>
            )}
            <p style={{ color: "white", textAlign: "center" }}>Release Year: {movieDetails.releaseYear}</p>
            {movieDetails.primaryImage && (
              <img
                src={movieDetails.primaryImage}
                alt={`Cover for ${movieDetails.title}`}
              />
            )}
            {movieDetails.releaseDate && (
              <p style={{ color: "white", textAlign: "center" }}>Release Date: {new Date(movieDetails.releaseDate).toLocaleDateString()}</p>
            )}
          </div>
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>Loading movie details...</p>
        )}
      </div>
    </PageLayout>
  );
};

export default DetailsPage;