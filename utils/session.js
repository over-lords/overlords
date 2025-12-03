export const SESSION_KEY = "session_user_id";

export function getSessionUserId() {
    return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(id) {
    localStorage.setItem(SESSION_KEY, id);
}

export function clearSessionUserId() {
    localStorage.removeItem(SESSION_KEY);
}