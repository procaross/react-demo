import React, { createContext, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favListUpdated, setFavListUpdated] = useState(false);

  const handleFavoritesUpdate = () => {
    setFavListUpdated(!favListUpdated);
  };

  return (
    <FavoritesContext.Provider value={{ favListUpdated, handleFavoritesUpdate }}>
      {children}
    </FavoritesContext.Provider>
  );
};