// 1. Mock Browser Environment
const mockStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, val) { this._data[key] = String(val); },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; },
    key(i) { return Object.keys(this._data)[i]; },
    get length() { return Object.keys(this._data).length; }
};

global.window = {
    localStorage: { ...mockStorage, _data: {} },
    sessionStorage: { ...mockStorage, _data: {} }
};
global.localStorage = global.window.localStorage;
global.sessionStorage = global.window.sessionStorage;

// 2. Mock ro
const roMock = {
    plugin: {
        add: function(name, def) {
            this[name] = def.body;
            if (def.install) def.install(this);
        }
    },
    obj: {
        get: function(obj, path) {
            if (!path) return obj;
            return path.split('.').reduce((acc, curr) => (acc && acc[curr] !== undefined) ? acc[curr] : undefined, obj);
        }
    },
    use: function(plugin) {
        this.plugin.add(plugin.name, plugin);
    }
};

// 3. Load Plugin & Tests
const registerPlugin = require('../dist/ro-storage.js');
const testStorage = require('./storage.test.js');
const testGetKeys = require('./getKeys.test.js');
const testGetJson = require('./getJson.test.js');

console.log('--- Node.js Verification Start ---');

try {
    // Register (Simulate ro.use)
    // dist 파일은 export default 형태일 수 있으므로 처리 필요
    // CommonJS require로 가져올 때 default가 있으면 그것을 사용
    const plugin = registerPlugin.default || registerPlugin;
    roMock.use(plugin);

    // Run Tests
    testStorage(roMock);
    testGetKeys(roMock);
    testGetJson(roMock);

} catch (e) {
    console.error(e);
    process.exit(1);
}