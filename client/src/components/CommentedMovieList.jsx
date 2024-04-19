import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import FavoriteButton from "./FavButton";
import { Link } from "react-router-dom";
import {Button} from "@mui/material";

const CommentedMoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userData } = useUser();
  const pageSize = 10;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/commented-movies?page=${currentPage}&pageSize=${pageSize}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch commented movies');
        }

        const data = await response.json();
        setMovies(data.movies);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching commented movies:', error);
        setError(error.toString());
      }
      setLoading(false);
    };

    fetchMovies();
  }, [userData, currentPage]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px'
  };

  if (error) {
    return <p>Error fetching data: {error}</p>;
  }

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1>Movies Buzzing Now</h1>
      {loading ? (
        <p style={{color: '#f5f5f5'}}>Loading...</p>
      ) : (
        <div style={gridStyle}>
          {movies.map(movie => (
            <div key={movie.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
              border: '1px solid #FFCCCC',
              borderRadius: '0.8rem',
              padding: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}>
              <Link to={`/movie/${movie.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{movie.title}</h3>
                <p>{movie.releaseYear}</p>
                {movie.primaryImage && (
                  <img
                    src={movie.primaryImage}
                    alt={`Image of ${movie.originalTitle}`}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
              </Link>
              <FavoriteButton movieId={movie.movieId} onClick={(e) => e.stopPropagation()} />
            </div>
          ))}
        </div>
      )}
      {!loading && currentPage < totalPages && (
        <Button onClick={handleLoadMore} sx={{position: 'absolute', right: '50px'}}>Next Page</Button>
      )}
    </div>
  );
};

export default CommentedMoviesList;