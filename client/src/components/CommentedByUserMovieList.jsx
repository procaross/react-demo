import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import FavoriteButton from "./FavButton";

const CommentedByUserMovieList = () => {
  const [commentedMovies, setCommentedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    const fetchCommentedMovies = async () => {
      if (userData && userData.id) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/users/${userData.id}/commented-movies`, {
            headers: {
              'Authorization': `Bearer ${userData.accessToken}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch commented movies');
          }

          const data = await response.json();
          setCommentedMovies(data);
        } catch (error) {
          console.error('Error fetching commented movies:', error);
        }
        setLoading(false);
      }
    };

    fetchCommentedMovies();
  }, [userData]);

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
    border: '1px solid #FFCCCC',
    borderRadius: '0.8rem',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  return (
    <div style={{ padding: '20px' }}>
      {userData && <h1>Movies You Commented On</h1>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={gridStyle}>
          {commentedMovies.map(movie => (
            <div key={movie.id} style={itemStyle}>
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
    </div>
  );
};

export default CommentedByUserMovieList;