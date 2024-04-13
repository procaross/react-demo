import React from "react";
import { NavLink } from "react-router-dom";
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

export const MobileNavBarBrand = ({ handleClick }) => {
  return (
    <div onClick={handleClick} className="mobile-nav-bar__brand">
      <NavLink to="/">
        <MovieFilterIcon
          sx={{
            width: 40,
            height: 40
          }}
        />
      </NavLink>
    </div>
  );
};
