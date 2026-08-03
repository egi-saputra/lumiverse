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

export async function ensureDeviceRegistered() {
    const deviceUuid = getOrCreateDeviceUuid();

    const { data } = await axios.post("/devices", {
        device_uuid: deviceUuid,
        platform: "web",
        device_name: navigator.userAgent.slice(0, 100),
    });

    localStorage.setItem(DEVICE_ID_KEY, data.device_id);

    return data.device_id;
}
