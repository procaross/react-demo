import React from "react";
import { MobileNavBarTab } from "./MobileNavBarTab";

export const MobileNavBarTabs = ({ handleClick }) => {

  return (
    <div className="mobile-nav-bar__tabs">
      <MobileNavBarTab
        path="/search"
        label="Search"
        handleClick={handleClick}
      />
      <MobileNavBarTab
        path="/profile"
        label="Profile"
        handleClick={handleClick}
      />
    </div>
  );
};
