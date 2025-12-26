import { useNavigate } from "react-router-dom";


export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user') as string);

    if (user && user.accessToken) {
        ResetInactivityTimeout();
        return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
    } else {
        return {};
    }
}

function ResetInactivityTimeout() {
    const navigate = useNavigate();
    clearTimeout((window as any).inactivityTimeout);
    (window as any).inactivityTimeout = setTimeout(() => {
        localStorage.clear();
        navigate('login');
    }, 3600000); // 1 hour in milliseconds
}