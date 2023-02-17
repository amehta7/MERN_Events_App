import AuthForm from "../components/AuthForm";
import { json, redirect } from "react-router-dom";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({ request }) => {
  console.log(request);

  const searchParams = new URL(request.url).searchParams;
  console.log(searchParams);
  const mode = searchParams.get("mode") || "login";
  console.log(mode);

  if (mode !== "login" && mode !== "signup") {
    throw json(
      { message: "Unsupported mode." },
      {
        status: 422,
      }
    );
  }

  const data = await request.formData();
  const authFormData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authFormData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json(
      { message: "Could not authenticate user." },
      {
        status: 500,
      }
    );
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1); //set for 1 hour bcs in backend expiry of token is 1 hour
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/");
};
