import { useAuth0 } from "@auth0/auth0-react";
import React, {useEffect} from "react";
import { PageLayout } from "../components/PageLayout";

export const ProfilePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let isMounted = true;

    const getMessage = async () => {
      const accessToken = await getAccessTokenSilently();
      console.log(accessToken)
      if (!isMounted) {
        return;
      }
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Profile
        </h1>
        <div className="content__body">
          <div className="profile-grid">
            <div className="profile__header">
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div className="profile__headline">
                <h2 className="profile__title">{user.name}</h2>
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
              <p>Given Name: {user.given_name}</p>
              <p>Family Name: {user.family_name}</p>
              <p>Nickname: {user.nickname}</p>
              <p>Locale: {user.locale}</p>
              <p>Email Verified: {user.email_verified ? "Yes" : "No"}</p>
              <p>Updated At: {new Date(user.updated_at).toLocaleString()}</p>
              <p>Sub: {user.sub}</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};