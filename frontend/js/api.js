
const API_BASE_URL = "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("vyntra_token");
}

function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("vyntra_user") || "null"
    );
}

async function apiRequest(path, method = "GET", body = undefined) {

    const headers = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (getToken()) {
        headers.Authorization = `Bearer ${getToken()}`;
    }

    const options = {
        method,
        headers
    };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        options
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
}

function requireLogin() {
    if (!getToken()) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function logout() {
    localStorage.removeItem("vyntra_token");
    localStorage.removeItem("vyntra_user");

    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

});
