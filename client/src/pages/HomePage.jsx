import React, { useEffect } from "react";
import { HeroBanner } from "../components/HeroBanner";
import { PageLayout } from "../components/PageLayout";
import { PublicPage } from "./PublicPage";
import {useAuth0} from "@auth0/auth0-react";
import {useUser} from "../contexts/UserContext";

export const HomePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userData, setUserData } = useUser();

  useEffect(() => {
    console.log("Current userData:", userData);
  }, [userData]);

  return (
    <PageLayout>
      <HeroBanner />
      <PublicPage />
    </PageLayout>
  )
}