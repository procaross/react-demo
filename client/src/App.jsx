import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/PageLoader";
import { AuthenticationGuard } from "./components/AuthenticationGuard";
import { CallbackPage } from "./pages/CallbackPage";
import { HomePage } from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";
import DetailsPage from "./pages/DetailsPage";

export const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/movie/:movieId" element={<DetailsPage/>}></Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
