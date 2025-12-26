import axios from "axios";
import authHeader from "./auth-header";
import { Equipment, EquipmentFilterResponse, EquipmentIdSearchParams, EquipmentSearchParams, EquipmentTree, NewEquipment } from "../interfaces";
import { useUser } from "../UserContext";

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPONTS = {
    EQUIPMENT: '/equipment',
    EQUIPMENT_TREE: '/equipment/tree',
    FILTERS: '/equipment/filters',
    ID: '/equipment/id',
}

const handleUnauthorized = () => {
    // localStorage.clear();
    // window.location.href = '/login';
    console.log('401 error');
};

export async function getEquipment(_params?: EquipmentSearchParams): Promise<Equipment[]> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('Error getting equipment' + error);
    }
};

export async function getEquipmentTree(userId: string): Promise<EquipmentTree> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT_TREE;
    try {
        const res = await axios.get(URL, { params: { userId: userId }, headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        return error.response.data;
    }
};

export async function getEquipmentFilters(_params?: EquipmentSearchParams): Promise<EquipmentFilterResponse> {
    const URL: string = base_URL + API_ENDPONTS.FILTERS;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { params: params, headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        return error.response.data;
    }
};

export async function getEquipmentId(equipment?: EquipmentIdSearchParams): Promise<string> {
    const URL: string = base_URL + API_ENDPONTS.ID;
    try {
        const res = await axios.get(URL, { params: equipment, headers: authHeader() });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('error getting equipment id' + error);
    }
};

export async function addNewEquipment(NewEquipment: NewEquipment): Promise<any> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT;
    try {
        const res = await axios.post(URL, { ...NewEquipment }, { headers: authHeader() });
        return res.data.message;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('Error adding new equipment: ' + error);
    }
};

export async function removeEquipment(equipmentId: string): Promise<void> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT;
    try {
        const res = await axios.delete(`${URL}/${equipmentId}`, { headers: authHeader() });
        return res.data.message;
    } catch (error: any) {
        if (error.response && error.response.status === 401) handleUnauthorized();
        throw new Error('Error removing equipment: ' + error);
    }
}

/******* BUILD PARAMETERS *******/
function buildParams(options: EquipmentSearchParams): URLSearchParams {
    // add parameters to the url
    let params = new URLSearchParams();
    const allowedParams: (keyof EquipmentSearchParams)[] = ['equipmentNameId', 'equipment_identifier', 'type'];

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