import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import FavoriteButton from "./FavButton";

const FavList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userData && userData.id) {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:8000/favorites', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.accessToken}`
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch favorites');
          }

          const data = await response.json();
          setFavorites(data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
        setLoading(false);
      }
    };

    fetchFavorites();
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
    border: '1px solid #555',
    borderRadius: '0.8rem',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  return (
    <div style={{ padding: '20px' }}>
      {userData && <h1 style={{ color: 'white' }}>Your Favorites</h1>}
      {loading ? (
        <p style={{color: 'white'}}>Loading...</p>
      ) : (
        <div style={gridStyle}>
          {favorites.map(movie => (
            <div key={movie.id} style={itemStyle}>
              <a href={`/movie/${movie.movieId}`} key={movie.id} style={{textDecoration: 'none', color: 'inherit'}}>
                <h3 style={{color: 'white'}}>{movie.title}</h3>
                <p style={{color: 'white'}}>{movie.releaseYear}</p>
                {movie.primaryImage && (
                  <img
                    src={movie.primaryImage}
                    alt={`Image of ${movie.originalTitle}`}
                    style={{width: '100%', height: 'auto'}}
                  />
                )}
              </a>
              <FavoriteButton movieId={movie.movieId} onClick={(e) => e.stopPropagation()}/>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FavList;