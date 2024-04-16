import React, { useEffect, useState, useCallback, useRef } from "react";
import FavButton from "../components/FavButton";
import FavList from "../components/FavList";
import {Link} from "react-router-dom";

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
    });
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px'
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    border: '1px solid #555',
    borderRadius: '0.8rem',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  return (
    <div className="content-layout" style={{ padding: '20px' }}>
      <FavList />
      <h1 style={{color: 'white'}}>Movie List</h1>
      <div style={gridStyle}>
        {movies.map((movie, index) => (
          <div style={itemStyle} ref={index === movies.length - 1 ? lastMovieElementRef : null}>
            <Link to={`/movie/${movie.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{color: 'white'}}>{movie.titleText.text}</h3>
              <p style={{color: 'white'}}>{movie.releaseYear.year}</p>
              {movie.primaryImage && (
                <img
                  src={movie.primaryImage.url}
                  alt={movie.primaryImage.caption.plainText}
                  style={{width: '100%', height: 'auto'}}
                />
              )}
            </Link>
            <FavButton movieId={movie.id} onClick={(e) => e.stopPropagation()}/>
          </div>

          ))}
      </div>
      {loading && <p>Loading more movies...</p>}
    </div>
  );
};