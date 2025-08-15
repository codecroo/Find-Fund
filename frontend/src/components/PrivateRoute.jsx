import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return isAuthenticated ? children : <Navigate to="/signin" />;
}
