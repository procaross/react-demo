import React, { useContext, useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import FavoriteButton from "./FavButton";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { Link } from "react-router-dom";

const FavList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 新增错误状态
  const { favListUpdated } = useContext(FavoritesContext);
  const { userData } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userData && userData.id) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8000/favorites?userId=${userData.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.accessToken}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch favorites');
          }

          const data = await response.json();
          setFavorites(data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setError(error.toString());
        }
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userData, favListUpdated]);

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
    <div style={{ padding: '20px' }}>
      {userData && <h1 style={{ color: 'white' }}>Your Favorites</h1>}
      {loading ? (
        <p style={{ color: 'white' }}>Loading...</p>
      ) : (
        <div style={gridStyle}>
          {favorites.map(movie => (
            <div key={movie.id} style={{
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
            }}>
              <Link to={`/movie/${movie.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ color: 'white' }}>{movie.title}</h3>
                <p style={{ color: 'white' }}>{movie.releaseYear}</p>
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

export default FavList;