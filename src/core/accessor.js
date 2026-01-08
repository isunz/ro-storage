// [ro-storage] src/core/accessor.js
import { createReactiveObject } from './reactive.js';
import { resolveData } from './helper.js';

/**
 * Storage Accessor Creator (구 createGlobalProxy)
 * 
 * 역할:
 * 1. ro.storage.session 처럼 스토리지 전체를 대변하는 객체를 생성합니다.
 * 2. 프로퍼티 접근 시 해당 키에 대한 Reactive Object를 생성해 반환합니다.
 * 3. getKeys, getJson 같은 유틸리티 메서드도 제공합니다.
 */
export function createStorageAccessor(type) {
    const win = (typeof window !== 'undefined') ? window : {};
    const storage = (type === 'local') ? win.localStorage : win.sessionStorage;

    // 기본 동작: 함수로 호출 시 (예: ro.storage.session('key'))
    const targetFunc = function(key, selector) {
        return createReactiveObject(key, type, selector);
    };

    if (!storage) return targetFunc;

    return new Proxy(targetFunc, {
        get(target, prop, receiver) {
            // 1. 함수 고유 속성 통과
            if (prop === 'length' || prop === 'name' || prop === 'prototype' || typeof prop === 'symbol') {
                return Reflect.get(target, prop, receiver);
            }
            
            // 2. 유틸리티 메서드 제공
            if (prop === 'getJson') {
                return function(path) {
                    return resolveData(type, path);
                }
            }
            if (prop === 'getKeys') {
                return function(path) {
                    const data = resolveData(type, path);
                    return (data && typeof data === 'object') ? Object.keys(data) : [];
                }
            }

            // 3. 스토리지 키 접근 -> Reactive Object 반환
            return createReactiveObject(prop, type);
        },
        set(target, prop, value) {
            // 4. 스토리지에 직접 값 할당
            if (typeof value === 'function') return true;
            if (value === null || value === undefined) {
                storage.removeItem(prop);
            } else {
                storage.setItem(prop, JSON.stringify(value));
            }
            return true;
        },
        deleteProperty(target, prop) {
            storage.removeItem(prop);
            return true;
        },
        ownKeys(target) {
            return Object.keys(storage);
        },
        getOwnPropertyDescriptor(target, prop) {
            if (Object.keys(storage).includes(prop)) {
                return { enumerable: true, configurable: true, writable: true };
            }
            return undefined;
        }
    });
}