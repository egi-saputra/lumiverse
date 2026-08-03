import axios from "axios";

const STORAGE_KEY = "lumi_device_uuid";
const DEVICE_ID_KEY = "lumi_device_id";

function generateUuid() {
    return crypto.randomUUID();
}

export function getOrCreateDeviceUuid() {
    let uuid = localStorage.getItem(STORAGE_KEY);
    if (!uuid) {
        uuid = generateUuid();
        localStorage.setItem(STORAGE_KEY, uuid);
    }
    return uuid;
}

export function getStoredDeviceId() {
    return localStorage.getItem(DEVICE_ID_KEY);
}
