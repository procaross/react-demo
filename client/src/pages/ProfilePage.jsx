import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { PageLayout } from "../components/PageLayout";
import {useUser} from "../contexts/UserContext";
import FavList from "../components/FavList";

export const ProfilePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userData, setUserData } = useUser();
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      const accessToken = await getAccessTokenSilently();

      try {
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

        if (isMounted) {
          setUserData({accessToken, ...data});
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently, user]);

  const updateUserInfo = async (updatedInfo) => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await fetch(`http://localhost:8000/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedInfo),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedUserData = await response.json();
      setUserData({accessToken, ...updatedUserData});
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!user || !userData) {
    return null;
  }

  return (
    <PageLayout>
      <FavList/>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">Profile</h1>
        <div className="content__body">
          <div className="profile-grid">
            <div className="profile__header">
              <img src={user.picture} alt="Profile" className="profile__avatar" />
              <div className="profile__headline">
                <h2 className="profile__title">{user.name}</h2>
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatedInfo = {
                    givenName: e.target.givenName.value,
                    familyName: e.target.familyName.value,
                    nickname: e.target.nickname.value,
                  };
                  updateUserInfo(updatedInfo);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <label>
                  Given Name:
                  <input type="text" name="givenName" defaultValue={userData.givenName}/>
                </label>
                <label>
                  Family Name:
                  <input type="text" name="familyName" defaultValue={userData.familyName}/>
                </label>
                <label>
                  Nickname:
                  <input type="text" name="nickname" defaultValue={userData.nickname}/>
                </label>
                <p>Email Verified: {userData.emailVerified ? "Yes" : "No"}</p>
                <p>Updated At: {new Date(userData.updatedAt).toLocaleString()}</p>
                <p>auth0 access token: {userData.accessToken}</p>
                <button type="submit">Update</button>
              </form>

            </div>
          </div>


        </div>
      </div>
    </PageLayout>
  );
};