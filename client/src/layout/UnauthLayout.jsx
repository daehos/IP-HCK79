import { Navigate, Outlet } from "react-router";

export default function UnauthLayout() {
  const isAuth = Boolean(localStorage.getItem("access_token"));

  if (!isAuth) {
    return (
      <>
        <Outlet />
      </>
    );
  }
  return <Navigate to={"/"} />;
}
