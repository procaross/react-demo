import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {PageLayout} from "../components/PageLayout";
import CommentSection from "../components/CommentSection";

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
      <div style={{ textAlign: "center" }}>
        <h1 style={{ textAlign: "center" }}>Movie Details</h1>
        {movieDetails ? (
          <div>
            <h2 style={{ textAlign: "center" }}>{movieDetails.title}</h2>
            {movieDetails.originalTitle && (
              <h3 style={{ textAlign: "center" }}>Original Title: {movieDetails.originalTitle}</h3>
            )}
            <p style={{ textAlign: "center" }}>Release Year: {movieDetails.releaseYear}</p>
            {movieDetails.primaryImage && (
              <img
                src={movieDetails.primaryImage}
                alt={`Cover for ${movieDetails.title}`}
                style={{width: '100%', height: 'auto'}}
              />
            )}
            {movieDetails.releaseDate && (
              <p style={{ textAlign: "center" }}>Release Date: {new Date(movieDetails.releaseDate).toLocaleDateString()}</p>
            )}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Loading movie details...</p>
        )}
        <CommentSection movieId={movieId}/>
      </div>
    </PageLayout>
  );
};

export default DetailsPage;