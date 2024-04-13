import React, { useEffect, useState } from "react";

const mockMovies = [
  { id: 1, title: "The Shawshank Redemption", year: 1994 },
  { id: 2, title: "The Godfather", year: 1972 },
  { id: 3, title: "The Dark Knight", year: 2008 },
];

export const PublicPage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        setMovies(mockMovies);
      }
    }, 1000);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMovieClick = (movie) => {
    alert(`You clicked ${movie.title}`);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px'
  };

  const itemStyle = {
    cursor: 'pointer',
    border: '1px solid #ccc',
    padding: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  return (
    <div className="content-layout" id="movie-exploration" style={{ padding: '20px' }}>
      <h1 id="page-title" className="content__title">Movie List</h1>
      <div className="content__body">
        <div style={gridStyle}>
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={itemStyle}
              onClick={() => handleMovieClick(movie)}
            >
              <h3>{movie.title}</h3>
              <p>{movie.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};