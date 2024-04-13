import React from "react";
import { NavBar } from "./navigation/desktop/NavBar";
import { MobileNavBar } from "./navigation/mobile/MobileNavBar";
import { PageFooter } from "./PageFooter";

export const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <NavBar />
      <MobileNavBar />
      <div className="page-layout__content">{children}</div>
      <PageFooter />
    </div>
  );
};
