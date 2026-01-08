// [ro-storage 프로젝트] src/index.js
import { setRo } from './core/context.js';
import { createReactiveObject } from './core/reactive.js';
import { createStorageAccessor } from './core/accessor.js';
import { getKeys, getSessionKeys, getLocalKeys } from './getKeys/index.js';
import { getJson, getSessionJson, getLocalJson } from './getJson/index.js';

export default {
    name: 'storage',
    install: function(ro, options) {
        setRo(ro);
    },
    body: {
        // Core Storage Accessors (Function + Proxy)
        session: createStorageAccessor('session'),
        local: createStorageAccessor('local'),
        
        // Creator Method
        create: function(arg, selector) {
            let key;
            let type = 'session';

            if (typeof arg === 'string') {
                key = arg;
            } else if (typeof arg === 'object' && arg !== null) {
                key = arg.key;
                if (arg.type) type = arg.type;
                if (arg.selector) selector = arg.selector;
            }

            return createReactiveObject(key, type, selector);
        },
        
        // Utility: Remove
        remove: function(key, type = 'session') {
            const win = (typeof window !== 'undefined') ? window : {};
            const storage = (type === 'local') ? win.localStorage : win.sessionStorage;
            if (storage) storage.removeItem(key);
        },
        
        // Utility: Keys
        getKeys,
        getSessionKeys,
        getLocalKeys,

        // Utility: JSON
        getJson,
        getSessionJson,
        getLocalJson
    }
};