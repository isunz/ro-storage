// 1. Mock Browser Environment (localStorage/sessionStorage)
const mockStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, val) { this._data[key] = String(val); },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; }
};

// Global Injection for Node
global.window = {
    localStorage: mockStorage,
    sessionStorage: mockStorage
};
global.localStorage = mockStorage;
global.sessionStorage = mockStorage;


// 2. Load Modules
// 실제로는 @mars-/ro가 설치되어 있어야 하지만,
// 테스트를 위해 ro의 최소 기능을 Mocking합니다.
const roMock = {
    plugin: {
        add: function(name, def) {
            this[name] = def.body; // Simple registration
        }
    },
    // storage plugin uses ro.obj.get if available
    obj: {
        get: function(obj, path) { return obj[path]; } // Simple mock
    }
};

// Bind context
roMock.plugin.add = roMock.plugin.add.bind(roMock);

// Load Plugin (Build result)
const registerPlugin = require('../dist/ro-storage.js');
const testStorage = require('./storage.test.js');

console.log('--- Node.js Verification Start ---');

try {
    // 3. Register Plugin
    registerPlugin(roMock);

    // 4. Run Test
    testStorage(roMock);

} catch (e) {
    console.error(e);
    process.exit(1);
}