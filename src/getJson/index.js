import { resolveData } from '../core/helper.js';

export function getJson(arg1, arg2) {
    return resolveData(arg1, arg2);
}

export function getSessionJson(path) {
    return getJson('session', path);
}

export function getLocalJson(path) {
    return getJson('local', path);
}