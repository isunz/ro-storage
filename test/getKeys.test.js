function testGetKeys(ro) {
    console.log('\n[Test] ro.storage.getKeys');

    // Setup Data
    ro.storage.session.testKey1 = { a: 1, b: 2 };
    ro.storage.session.testKey2 = { c: 3 };
    ro.storage.local.testKey3 = { d: 4 };

    // 1. Test Global Keys (Session Default)
    const sessionKeys = ro.storage.getKeys();
    if (sessionKeys.includes('testKey1') && sessionKeys.includes('testKey2')) {
        // console.log('✅ Global session keys found');
    } else {
        throw new Error('❌ Global session keys failed: ' + sessionKeys);
    }

    // 2. Test Local Keys
    const localKeys = ro.storage.getKeys('local');
    if (localKeys.includes('testKey3')) {
        // console.log('✅ Global local keys found');
    } else {
        throw new Error('❌ Global local keys failed: ' + localKeys);
    }

    // 3. Test Nested Keys
    const nestedKeys = ro.storage.getKeys('session', 'testKey1');
    if (nestedKeys.includes('a') && nestedKeys.includes('b')) {
        // console.log('✅ Nested keys found');
    } else {
        throw new Error('❌ Nested keys failed: ' + nestedKeys);
    }

    // 4. Test Wrapper Functions
    const wKeys = ro.storage.getSessionKeys('testKey1');
    if (wKeys.includes('a')) {
        // console.log('✅ getSessionKeys wrapper works');
    } else {
        throw new Error('❌ getSessionKeys wrapper failed');
    }

    // Cleanup
    ro.storage.remove('testKey1');
    ro.storage.remove('testKey2');
    ro.storage.remove('testKey3', 'local');
    
    console.log('✅ ALL getKeys TESTS PASSED');
}

if (typeof module !== 'undefined') module.exports = testGetKeys;