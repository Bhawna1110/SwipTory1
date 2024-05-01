import { Navigate, useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";

export const ProtectRoute = ({ children }) => {
  const [{ userLoggedIn }, dispatch] = useStateValue();
  let location = useLocation();
  if (!userLoggedIn && location.pathname === "/bookmark") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (!userLoggedIn && location.pathname === "/your-story") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export const PublicRoute = ({ children }) => {
  if (sessionStorage.getItem("token")) {
    return <Navigate to={"/"} />;
  }
  return children;
};
