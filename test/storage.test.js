// ro 객체를 받아서 테스트를 수행하는 함수
function testStorage(ro) {
    console.log('\n[Test] ro.storage Plugin');

    // 1. Check Registration
    if (!ro.storage || typeof ro.storage.session !== 'function') {
        throw new Error('❌ Plugin not registered properly');
    }

    const TEST_KEY = 'RO_TEST_DATA';

    // Clear previous data
    ro.storage.remove(TEST_KEY);

    // 2. Create Storage Proxy
    const store = ro.storage.session(TEST_KEY);

    // 3. Test Set & Reactivity
    store.theme = 'dark';
    store.config = { vol: 10 };

    // Verify memory
    if (store.theme === 'dark' && store.config.vol === 10) {
        // console.log('✅ Set value works');
    } else {
        throw new Error('❌ Set value failed');
    }

    // Verify persistence (simulate reload by reading raw storage)
    let raw = sessionStorage.getItem(TEST_KEY); // Node test에서는 Mock 사용됨
    if (raw && raw.includes('"theme":"dark"')) {
        // console.log('✅ Persistence (save) works');
    } else {
        throw new Error('❌ Persistence failed: ' + raw);
    }

    // 4. Test Nested Reactivity
    store.config.vol = 20; // Deep update
    raw = sessionStorage.getItem(TEST_KEY);
    if (raw && raw.includes('"vol":20')) {
        // console.log('✅ Nested reactivity works');
    } else {
        throw new Error('❌ Nested reactivity failed');
    }

    // 5. Cleanup
    ro.storage.remove(TEST_KEY);
    if (sessionStorage.getItem(TEST_KEY) === null) {
        // console.log('✅ Remove works');
    } else {
        throw new Error('❌ Remove failed');
    }

    console.log('✅ ALL STORAGE TESTS PASSED');
}

// CommonJS export for Node.js
if (typeof module !== 'undefined') module.exports = testStorage;