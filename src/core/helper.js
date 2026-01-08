// [ro-storage] src/core/helper.js
import { getRo } from './context.js';

/**
 * 데이터 조회 및 파싱 헬퍼
 * 스토리지 타입과 경로(path)를 받아 실제 데이터를 반환합니다.
 */
export function resolveData(arg1, arg2) {
    let type = 'session';
    let path = undefined;

    if (typeof arg1 === 'object' && arg1 !== null) {
        if (arg1.type) type = arg1.type;
        if (arg1.path) path = arg1.path;
    } else if (typeof arg1 === 'string') {
        if (arg1 === 'local' || arg1 === 'session') {
            type = arg1;
            if (typeof arg2 === 'string') path = arg2;
        }
    }
    
    const win = (typeof window !== 'undefined') ? window : {};
    const storage = (type === 'local') ? win.localStorage : win.sessionStorage;
    
    if (!storage) return {};

    // path가 없으면 전체 스토리지 파싱 반환
    if (!path) {
        const res = {};
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            try {
                res[key] = JSON.parse(storage.getItem(key));
            } catch (e) {
                res[key] = storage.getItem(key);
            }
        }
        return res;
    }

    // path가 있으면
    const parts = path.split('.');
    const rootKey = parts[0];
    const subPath = parts.slice(1).join('.');

    let rootData;
    try {
        const raw = storage.getItem(rootKey);
        rootData = raw ? JSON.parse(raw) : {};
    } catch (e) { rootData = {}; }

    if (!subPath) return rootData;

    const ro = getRo();
    if (ro && ro.obj && ro.obj.get) {
        return ro.obj.get(rootData, subPath);
    }
    
    // fallback (ro가 없을 때)
    return subPath.split('.').reduce((acc, curr) => (acc && acc[curr] !== undefined) ? acc[curr] : undefined, rootData);
}