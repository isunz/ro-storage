function testGetJson(ro) {
    console.log('\n[Test] ro.storage.getJson');

    // Setup Data
    const data = { user: { name: 'Sun', age: 30 } };
    ro.storage.session.jsonData = data;

    // 1. Test Full JSON
    const full = ro.storage.getJson('session', 'jsonData');
    if (full.user.name === 'Sun') {
        // console.log('✅ Full JSON retrieval works');
    } else {
        throw new Error('❌ Full JSON retrieval failed');
    }

    // 2. Test Nested JSON
    const nested = ro.storage.getJson('session', 'jsonData.user');
    if (nested.age === 30) {
        // console.log('✅ Nested JSON retrieval works');
    } else {
        throw new Error('❌ Nested JSON retrieval failed');
    }

    // 3. Test Wrapper
    const wJson = ro.storage.getSessionJson('jsonData.user');
    if (wJson.name === 'Sun') {
        // console.log('✅ getSessionJson wrapper works');
    } else {
        throw new Error('❌ getSessionJson wrapper failed');
    }

    // Cleanup
    ro.storage.remove('jsonData');
    
    console.log('✅ ALL getJson TESTS PASSED');
}

if (typeof module !== 'undefined') module.exports = testGetJson;