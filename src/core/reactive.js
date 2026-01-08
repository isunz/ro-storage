// [ro-storage] src/core/reactive.js
import { getRo } from './context.js';

/**
 * Reactive Object Creator (구 createProxy)
 * 
 * 역할:
 * 1. 스토리지의 특정 키(storageKey)에 해당하는 데이터를 로드합니다.
 * 2. 객체의 속성 변경(set, delete)을 감지하여 스토리지에 자동 저장합니다.
 * 3. 중첩된 객체도 재귀적으로 Proxy로 감싸 반응성을 유지합니다.
 */
export function createReactiveObject(storageKey, type, selector) {
    const win = (typeof window !== 'undefined') ? window : {};
    const storage = (type === 'local') ? win.localStorage : win.sessionStorage;

    if (!storage) {
        console.warn(`[ro.storage] ${type} storage is not available.`);
        return {};
    }

    let rootData;
    try {
        const raw = storage.getItem(storageKey);
        rootData = raw ? JSON.parse(raw) : {};
    } catch (e) { rootData = {}; }

    function save() {
        try { storage.setItem(storageKey, JSON.stringify(rootData)); } catch (e) {}
    }

    const handler = {
        get(target, prop) {
            if (prop === '_raw') return target;
            if (prop === '_ls') return Object.keys(target);
            
            const value = target[prop];
            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, handler);
            }
            return value;
        },
        set(target, prop, value) {
            if (typeof value === 'function') return true;
            target[prop] = value;
            save();
            return true;
        },
        deleteProperty(target, prop) {
            delete target[prop];
            save();
            return true;
        }
    };

    const proxyRoot = new Proxy(rootData, handler);

    // selector가 있으면 ro.obj.get을 이용해 내부 객체 반환
    const ro = getRo();
    if (selector && ro && ro.obj && ro.obj.get) {
        return ro.obj.get(proxyRoot, selector);
    }

    return proxyRoot;
}