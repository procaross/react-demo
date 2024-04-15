import React, {useState, useEffect, useContext} from 'react';
import { useUser } from '../contexts/UserContext';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { FavoritesContext } from "../contexts/FavoritesContext";

const FavoriteButton = ({ movieId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { userData } = useUser();
  const { handleFavoritesUpdate } = useContext(FavoritesContext);
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (userData && userData.id) {
        const response = await fetch(`http://localhost:8000/isFavorite?userId=${userData.id}&movieId=${movieId}`, {
          headers: {
            'Authorization': `Bearer ${userData.accessToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setIsFavorite(data.isFavorite);
        } else {
          console.error('Failed to fetch favorite status');
        }
      }
    };

    checkFavoriteStatus();
  }, [userData, movieId]);

  const handleFavoriteToggle = async () => {
    if (!userData || !userData.id) {
      console.error('User data is not available');
      return;
    }

    const method = isFavorite ? 'DELETE' : 'POST';
    const url = `http://localhost:8000/favorites`;

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.accessToken}`,
      },
      body: JSON.stringify({ userId: userData.id, movieId }),
    });

    if (response.ok) {
      setIsFavorite(!isFavorite);
      handleFavoritesUpdate();
    } else {
      console.error('Failed to update favorite status');
    }
  };

  return (
    <IconButton
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={handleFavoriteToggle}
      color={isFavorite ? 'error' : 'info'}
      sx={{width: 40, height: 40}}
    >
      {isFavorite ? <FavoriteIcon sx={{width: 40, height: 40}}/> : <FavoriteBorderIcon sx={{width: 40, height: 40}}/>}
    </IconButton>
  );
};

export default FavoriteButton;