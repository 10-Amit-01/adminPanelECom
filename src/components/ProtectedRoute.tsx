import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoutes() {
  // const isLoggedIn = localStorage.getItem("adminLoginAccessToken");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [isLoggedIn, navigate]);
  return <Outlet />;
}
