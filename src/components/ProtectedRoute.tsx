import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { useEffect } from "react";

export default function ProtectedRoutes() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const localToken = localStorage.getItem("accessToken");
    if (!token && !localToken) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <Outlet />;
}
