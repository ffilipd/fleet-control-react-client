import axios from "axios";
import { NewReport, Report, ReportSearchParams } from "../interfaces";
import authHeader from "./auth-header";

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPONTS = {
    REPORTS: '/report',
    DAMAGE_TYPES: '/report/damage-types',
}

const handleUnauthorized = () => {
    localStorage.clear();
    window.location.href = '/login';
};

export const getReports = async (_params?: ReportSearchParams): Promise<Report[]> => {
    const URL: string = base_URL + API_ENDPONTS.REPORTS;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { params: params, headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('error getting bookings' + error);
    }
}

export const getReportById = async (id: string): Promise<Report[]> => {
    const URL: string = base_URL + API_ENDPONTS.REPORTS;
    try {
        const res = await axios.get(`${URL}/${id}`, { headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('error getting bookings' + error);
    }
}

export const addReport = async (newReport: NewReport): Promise<void> => {
    const URL: string = base_URL + API_ENDPONTS.REPORTS;
    try {
        await axios.post(URL, { ...newReport }, { headers: authHeader() });
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('Error adding new booking: ' + error);
    }
}

export const getDamageTypes = async (): Promise<any> => {
    const URL: string = base_URL + API_ENDPONTS.DAMAGE_TYPES;
    try {
        return await axios.get(URL, { headers: authHeader() });
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error("Error getting damage types: " + error);
    }
}

/******* BUILD PARAMETERS *******/
function buildParams(options: ReportSearchParams): URLSearchParams {
    // add parameters to the url
    let params = new URLSearchParams();
    const allowedParams: (keyof ReportSearchParams)[] = ['equipment_name', 'equipment_identifier', 'type', 'date', 'bookingId', 'damage_type', 'user_id'];

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