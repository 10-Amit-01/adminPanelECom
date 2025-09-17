import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { useEffect } from "react";

export default function ProtectedRoutes() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  
  if(!token) return null;

  return <Outlet />;
}
