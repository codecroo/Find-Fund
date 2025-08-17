import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("role"); // assuming you store role in localStorage

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" />; // redirect to landing page (or unauthorized page)
    }

    return children;
}