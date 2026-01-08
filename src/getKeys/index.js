import { resolveData } from '../core/helper.js';

export function getKeys(arg1, arg2) {
    const data = resolveData(arg1, arg2);
    return (data && typeof data === 'object') ? Object.keys(data) : [];
}

export function getSessionKeys(path) {
    return getKeys('session', path);
}

export function getLocalKeys(path) {
    return getKeys('local', path);
}