import React from "react";
import { NavLink } from "react-router-dom";
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

export const NavBarBrand = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <MovieFilterIcon
          sx={{
            width: 50,
            height: 50
          }}
        />
      </NavLink>
    </div>
  );
};
