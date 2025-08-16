import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true, // <-- important (sends cookies incl. CSRF + sessionid)
});

// Attach CSRF token automatically
api.interceptors.request.use((config) => {
    const csrfToken = getCookie("csrftoken"); // helper below
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

// Helper to read csrftoken from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export default api;
