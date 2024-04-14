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
    const fetchUserData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/users/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          ...data,
          accessToken
        });
      }
    };

    fetchUserData();
  }, [user, getAccessTokenSilently, setUserData]);

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