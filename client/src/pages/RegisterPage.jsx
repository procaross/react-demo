import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RegisterPage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleRegister = () => {
    loginWithRedirect({
      screen_hint: "signup",
    });
  };

  return (
    <div>
      <h1>Register Page</h1>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterPage;
