import React from "react";
import { NavBarTab } from "./NavBarTab";

export const NavBarTabs = () => {

  return (
    <div className="nav-bar__tabs">
      <NavBarTab path="/search" label="Search" />
      <NavBarTab path="/profile" label="Profile" />
    </div>
  );
};
