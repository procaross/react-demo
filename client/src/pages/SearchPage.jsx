import React, { useState, useEffect, useCallback, useRef } from "react";
import { PageLayout } from "../components/PageLayout";
import debounce from "lodash/debounce";
import FavButton from "../components/FavButton";

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const debouncedFetchData = useCallback(
    debounce(async (searchTerm, page) => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/search/movies?term=${searchTerm}&page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        console.log(data)
        setMovies(prevMovies => [...prevMovies, ...data]);
        setHasMore(data.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedFetchData(searchTerm, page);
    }
  }, [searchTerm, page, debouncedFetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setMovies([]);
    debouncedFetchData(searchTerm, 1);
  };

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
    <PageLayout>
      <div
        className="content-layout"
        id="movie-exploration"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "20px",
        }}
      >
        <h1 id="page-title" className="content__title">
          Search Movies
        </h1>
        <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "500px" }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          />
        </form>
        <div style={gridStyle}>
          {movies.map((movie, index) => (
            <div style={itemStyle} ref={index === movies.length - 1 ? lastMovieElementRef : null}>
              <a href={`/movie/${movie.id}`} key={movie._id} style={{textDecoration: 'none', color: 'inherit'}}>
                <h3 style={{color: 'white'}}>{movie.titleText.text}</h3>
                <p style={{color: 'white'}}>{movie.releaseYear.year}</p>
                {movie.primaryImage && (
                  <img
                    src={movie.primaryImage.url}
                    alt={movie.primaryImage.caption.plainText}
                    style={{width: '100%', height: 'auto'}}
                  />
                )}
              </a>
              <FavButton movieId={movie.id} onClick={(e) => e.stopPropagation()}/>
            </div>

          ))}
        </div>
      </div>
      {loading && <p>Loading more movies...</p>}
    </PageLayout>
  );
};