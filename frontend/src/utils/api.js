export async function apiPost(url, data) {
    const res = await fetch(`http://localhost:8000/api${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // important for session cookies
    });
    return res.json();
}

export async function apiGet(url) {
    const res = await fetch(`http://localhost:8000/api${url}`, {
        credentials: "include",
    });
    return res.json();
}
