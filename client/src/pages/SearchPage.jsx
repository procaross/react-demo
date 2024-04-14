import React, { useState } from "react";
import { PageLayout } from "../components/PageLayout";
import { useNavigate } from "react-router-dom";

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.match(/^tt\d{7}$/)) {
      navigate(`/movie/${searchTerm}`);
    } else {
      alert("Invalid search format. Please enter 'tt' followed by 7 digits.");
    }
  };

  return (
    <PageLayout>
      <div
        className="content-layout"
        id="movie-exploration"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "20px",
        }}
      >
        <h1 id="page-title" className="content__title">
          Search Movies
        </h1>
        <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "500px" }}>
          <input
            type="text"
            placeholder="Search by title (e.g., tt1234567)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pattern="^tt\d{7}$"
            title="Please enter 'tt' followed by 7 digits"
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          />
        </form>
      </div>
    </PageLayout>
  );
};