import React, { useState, useEffect, useCallback, useRef } from "react";
import {Button, Input} from "@mui/material";
import { PageLayout } from "../components/PageLayout";
import FavButton from "../components/FavButton";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
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

  const fetchData = async (term, pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/search/movies?keyword=${term}&page=${pageNum}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(prevMovies => {
        const newMovies = data.filter(movie => !prevMovies.some(m => m.id === movie.id));
        return [...prevMovies, ...newMovies];
      });
      setHasMore(data.length > 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm) {
      fetchData(searchTerm, page);
    }
  }, [page]);

  const handleSearchClick = () => {
    setMovies([]);
    setPage(1);
    fetchData(searchTerm, 1);
  };

  return (
    <PageLayout>
      <div className="content-layout" id="movie-exploration" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", padding: "20px" }}>
        <h1 id="page-title" className="content__title">Search Movies</h1>
        <Input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{fontSize: '20px', width:'70vw', mb:'2rem', px: '1rem'}}/>
        <IconButton variant="contained" color="primary" onClick={handleSearchClick} style={{ marginBottom: "20px" }} sx={{fontSize: '50px'}}><SearchIcon sx={{color: 'black', fontSize: '30px'}}/></IconButton>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' }}>
          {movies.map((movie, index) => (
            <div key={movie._id} ref={index === movies.length - 1 ? lastMovieElementRef : null} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', cursor: 'pointer', border: '1px solid #555', borderRadius: '0.8rem', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
              <a href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{movie.titleText.text}</h3>
                <p>{movie.releaseYear?.year}</p>
                {movie.primaryImage && (
                  <img src={movie.primaryImage.url} alt={movie.primaryImage.caption.plainText} style={{ width: '100%', height: 'auto' }} />
                )}
              </a>
              <FavButton movieId={movie.id} />
            </div>
          ))}
        </div>
        {loading && <p>Loading more movies...</p>}
      </div>
    </PageLayout>
  );
};