export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user') as string);

    if (user && user.accessToken) {
        resetInactivityTimeout();
        return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
    } else {
        return {};
    }
}

function resetInactivityTimeout() {
    clearTimeout((window as any).inactivityTimeout);
    (window as any).inactivityTimeout = setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
    }, 3600000); // 1 hour in milliseconds
}