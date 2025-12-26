import axios from "axios";
import { Booking, BookingSearchParams, NewBooking } from "../interfaces";
import authHeader from "./auth-header";

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPOINTS = {
    BOOKINGS: '/bookings',
}

const handleUnauthorized = () => {
    localStorage.clear();
    window.location.href = '/login';
};

export const getBookings = async (_params?: BookingSearchParams): Promise<Booking[]> => {
    const URL: string = base_URL + API_ENDPOINTS.BOOKINGS;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { params: params, headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('error getting bookings' + error);
    }
}

export const addBooking = async (newBooking: NewBooking): Promise<any> => {
    const URL: string = base_URL + API_ENDPOINTS.BOOKINGS;
    try {
        const res = await axios.post(URL, { ...newBooking }, { headers: authHeader() });
        return res.data.message;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        return ('Error adding new booking: ' + error);
    }
}

export const deleteBooking = async (bookingId: string): Promise<void> => {
    const URL: string = base_URL + API_ENDPOINTS.BOOKINGS;
    try {
        const res = await axios.delete(`${URL}/${bookingId}`, { headers: authHeader() });
        return res.data.message;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('Error deleting booking: ' + error);
    }
}

/******* BUILD PARAMETERS *******/
function buildParams(options: BookingSearchParams): URLSearchParams {
    // add parameters to the url
    let params = new URLSearchParams();
    const allowedParams: (keyof BookingSearchParams)[] = ['userId', 'equipment_type', 'equipmentNameId', 'equipmentId', 'date', 'time_from', 'time_to', 'usage'];

    // Loop through parameters
    for (const key of allowedParams) {
        const optionValue = options[key];
        // If parameter is specified
        if (optionValue !== undefined && optionValue !== null) {
            // If multiple values in parameter, join then with '_'
            const paramValue = Array.isArray(optionValue) ? optionValue.join('_') : optionValue;
            // Append paramter to request
            params.append(String(key), paramValue.toString());
        }
    }
    return params;
}