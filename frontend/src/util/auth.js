import { redirect } from "react-router-dom";

export const getTokenDuration = () => {
  //calculate remaining lifetime of token in millisec
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate); //string to date obj
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime(); //if it returns +ve value then token is not expired else for -ve value token is expired
  return duration;
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    //token expired
    return "TOKEN EXPIRED";
  }

  return token;
};

export const tokenLoader = () => {
  return getAuthToken();
};

export const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth");
  }

  return null;
};
