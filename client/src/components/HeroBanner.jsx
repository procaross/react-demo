import React from "react";

export const HeroBanner = () => {
  const logo = "https://example.com/path-to-your-movie-site-logo.svg";

  const handleScrollToContent = () => {
    const nextSection = document.getElementById("movie-exploration");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="hero-banner hero-banner--cinema">
      <h1 className="hero-banner__headline">Welcome to Cinema World!</h1>

      <p className="hero-banner__description">
        Discover the latest movies, classic hits, and experience an
        unforgettable journey into the magic of film with <strong>Cinema World</strong>.
      </p>
    </div>
  );
};