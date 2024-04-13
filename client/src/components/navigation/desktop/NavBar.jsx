import React from "react";
import { NavBarBrand } from "./NavBarBrand";
import { NavBarButtons } from "./NavBarButtons";
import { NavBarTabs } from "./NavBarTabs";

export const NavBar = () => {
  return (
    <div className="nav-bar__container">
      <nav className="nav-bar">
        <NavBarBrand />
        <NavBarTabs />
        <NavBarButtons />
      </nav>
    </div>
  );
};
