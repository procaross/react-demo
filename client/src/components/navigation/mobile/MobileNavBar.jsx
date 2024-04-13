import React from "react";
import { MobileMenuToggleButton } from "./MobileMenuToggleButton";
import { MobileNavBarBrand } from "./MobileNavBarBrand";
import { MobileNavBarButtons } from "./MobileNavBarButtons";
import { MobileNavBarTabs } from "./MobileNavBarTabs";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
const MobileMenuState = {
  CLOSED: "closed",
  OPEN: "open",
};

const MobileMenuIcon = {
  CLOSE: <CloseIcon sx={{width: 40, height: 40}}/>,
  MENU: <MenuIcon sx={{width: 40, height: 40}}/>,
};

export const MobileNavBar = () => {
  const [mobileMenuState, setMobileMenuState] = React.useState(
    MobileMenuState.CLOSED
  );
  const [mobileMenuIcon, setMobileMenuIcon] = React.useState(
    MobileMenuIcon.MENU
  );

  const isMobileMenuOpen = () => {
    return mobileMenuState === MobileMenuState.OPEN;
  };

  const closeMobileMenu = () => {
    document.body.classList.remove("mobile-scroll-lock");
    setMobileMenuState(MobileMenuState.CLOSED);
    setMobileMenuIcon(MobileMenuIcon.MENU);
  };

  const openMobileMenu = () => {
    document.body.classList.add("mobile-scroll-lock");
    setMobileMenuState(MobileMenuState.OPEN);
    setMobileMenuIcon(MobileMenuIcon.CLOSE);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  return (
    <div className="mobile-nav-bar__container">
      <nav className="mobile-nav-bar">
        <MobileNavBarBrand handleClick={closeMobileMenu} />
        <MobileMenuToggleButton
          icon={mobileMenuIcon}
          handleClick={toggleMobileMenu}
        />

        {isMobileMenuOpen() && (
          <div className="mobile-nav-bar__menu">
            <MobileNavBarTabs handleClick={closeMobileMenu} />
            <MobileNavBarButtons />
          </div>
        )}
      </nav>
    </div>
  );
};
