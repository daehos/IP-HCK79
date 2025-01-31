import { Navigate, Outlet } from "react-router";
import Navbar from "../components/ui/Navbar";
// import { Navbar } from "../ui/navbar";

export default function AuthLayout() {
  const isAuth = localStorage.access_token;
  if (isAuth) {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }

  return <Navigate to={"/login"} />;
}
