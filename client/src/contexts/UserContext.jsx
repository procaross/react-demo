import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0();

  const fetchUserData = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/users/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUserData({ accessToken, ...data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, getAccessTokenSilently, fetchUserData]);

  const value = {
    userData,
    setUserData,
    refetchUserData: () => fetchUserData()
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};