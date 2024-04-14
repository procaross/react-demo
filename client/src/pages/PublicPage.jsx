import React, { useEffect, useState, useCallback, useRef } from "react";

export const PublicPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastMovieElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1);
      }
    })
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/movies?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(prevMovies => [...prevMovies, ...data]);
        setHasMore(data.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleMovieClick = (movie) => {
    alert(`You clicked ${movie.titleText.text}`);
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
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  return (
    <div className="content-layout" id="movie-exploration" style={{ padding: '20px' }}>
      <h1 id="page-title" className="content__title">Movie List</h1>
      <div className="content__body">
        <div style={gridStyle}>
          {movies.map((movie, index) => {
            if (movies.length === index + 1) {
              return (
                <div ref={lastMovieElementRef}
                     key={movie._id}
                     style={itemStyle}
                     onClick={() => handleMovieClick(movie)}>
                  <h3 style={{color: 'white'}}>{movie.titleText.text}</h3>
                  <p>{movie.releaseYear.year}</p>
                  {movie.primaryImage && (
                    <img
                      src={movie.primaryImage.url}
                      alt={movie.primaryImage.caption.plainText}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  )}
                </div>
              );
            } else {
              return (
                <div key={movie._id}
                     style={itemStyle}
                     onClick={() => handleMovieClick(movie)}>
                  <h3 style={{color: 'white'}}>{movie.titleText.text}</h3>
                  <p>{movie.releaseYear.year}</p>
                  {movie.primaryImage && (
                    <img
                      src={movie.primaryImage.url}
                      alt={movie.primaryImage.caption.plainText}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  )}
                </div>
              );
            }
          })}
        </div>
        {loading && <p style={{color: 'white'}}>Loading more movies...</p>}
      </div>
    </div>
  );
};