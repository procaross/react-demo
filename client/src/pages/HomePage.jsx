import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  console.log(isAuthenticated)
  const [anonymousContent, setAnonymousContent] = useState([]);
  const [userContent, setUserContent] = useState([]);

  useEffect(() => {
    const fetchAnonymousContent = async () => {
      try {
        const response = await fetch("/api/anonymous-content");
        const data = await response.json();
        setAnonymousContent(data);
      } catch (error) {
        console.error("Error fetching anonymous content:", error);
      }
    };

    const fetchUserContent = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log(token)
        const response = await fetch("/api/user-content", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserContent(data);
      } catch (error) {
        console.error("Error fetching user content:", error);
      }
    };

    fetchAnonymousContent();
    if (isAuthenticated) {
      fetchUserContent();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div>
      <h1>Welcome to our App</h1>
      <h2>Anonymous Content</h2>
      <ul>
        {anonymousContent.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      {isAuthenticated && (
        <>
          <h2>User Content</h2>
          <ul>
            {userContent.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default HomePage;
