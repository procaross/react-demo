import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { PageLayout } from "../components/PageLayout";
import {useUser} from "../contexts/UserContext";
import FavList from "../components/FavList";
import CommentedMovieList from "../components/CommentedMovieList";
import {Button, Input} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ellipsisAccessToken = {
  overflow: 'hidden',
  wordBreak: 'break-all',
  maxWidth: '400px',
  cursor: 'pointer'
};

export const ProfilePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { userData, setUserData } = useUser();

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
      <CommentedMovieList/>
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
                  <Input type="text" name="givenName" defaultValue={userData.givenName} sx={{fontSize: '18px', ml: '10px'}}/>
                </label>
                <label>
                  Family Name:
                  <Input type="text" name="familyName" defaultValue={userData.familyName}  sx={{fontSize: '18px', ml: '10px'}}/>
                </label>
                <label>
                  Nickname:
                  <Input type="text" name="nickname" defaultValue={userData.nickname}  sx={{fontSize: '18px', ml: '10px'}}/>
                </label>
                <p>Email Verified: {userData.emailVerified ? "Yes" : "No"}</p>
                <p>Updated At: {new Date(userData.updatedAt).toLocaleString()}</p>
                <p style={ellipsisAccessToken}>auth0 access token: <span
                  title={userData.accessToken}>{userData.accessToken}</span></p>
                <Button type="submit" sx={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>
                  <ArrowUpwardIcon sx={{mr: '10px', fontWeight: 'bold', fontSize: '20px'}}/>
                  Submit
                </Button>
              </form>

            </div>
          </div>


        </div>
      </div>
    </PageLayout>
  );
};