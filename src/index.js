/**
 * @mars-/ro-storage Plugin
 * * ro 라이브러리에 반응형 스토리지(Proxy) 기능을 추가합니다.
 * * @param {Object} ro - @mars-/ro 라이브러리 인스턴스
 */
export default function registerStoragePlugin(ro) {

    // 방어 코드: ro 라이브러리가 올바르게 전달되었는지 확인
    if (!ro || !ro.plugin || !ro.plugin.add) {
        console.error('[@mars-/ro-storage] ro library is missing or invalid.');
        return;
    }

    // --- 내부 함수: Proxy 생성기 ---
    function createProxy(storageKey, type, selector) {
        const storage = type === 'local' ? window.localStorage : window.sessionStorage;

        // 1. 초기 데이터 로드 (없으면 빈 객체)
        let rootData;
        try {
            const raw = storage.getItem(storageKey);
            rootData = raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error(`[ro.storage] Load failed for '${storageKey}'`, e);
            rootData = {};
        }

        // 2. 저장 함수 (디바운스 없이 즉시 저장)
        function save() {
            try {
                storage.setItem(storageKey, JSON.stringify(rootData));
            } catch (e) {
                console.error(`[ro.storage] Save failed for '${storageKey}'`, e);
            }
        }

        // 3. Proxy 핸들러 (재귀적 변경 감지)
        const handler = {
            get(target, prop) {
                // 특수 명령어
                if (prop === '_raw') return target;
                if (prop === '_ls') return Object.keys(target);

                const value = target[prop];

                // 값이 객체라면 그 내부도 감지해야 하므로 또 Proxy를 씌워서 반환
                if (typeof value === 'object' && value !== null) {
                    return new Proxy(value, handler);
                }
                return value;
            },
            set(target, prop, value) {
                // 함수 저장 방지
                if (typeof value === 'function') {
                    console.warn(`[ro.storage] Functions cannot be saved: ${String(prop)}`);
                    return true;
                }

                target[prop] = value; // 메모리 상 객체 변경
                save();               // 스토리지 동기화
                return true;
            },
            deleteProperty(target, prop) {
                delete target[prop];
                save();
                return true;
            }
        };

        // 4. 전체 데이터에 Proxy 적용
        const proxyRoot = new Proxy(rootData, handler);

        // 5. 선택자(Selector) 지원
        // ro.obj.get 기능이 있다면 활용하여 특정 경로만 반환
        if (selector && ro.obj && ro.obj.get) {
            const selected = ro.obj.get(proxyRoot, selector);
            // 편의상 undefined 대신 빈 객체를 반환하고 싶다면 여기서 처리 가능하나,
            // 원본 데이터와의 연결성을 위해 있는 그대로 반환함.
            return selected;
        }

        return proxyRoot;
    }

    // --- 플러그인 등록 ---
    ro.plugin.add('storage', {
        version: '1.0.0',
        body: {
            /**
             * 세션 스토리지 사용 (브라우저 닫으면 삭제)
             * @param {string} key 저장소 키
             * @param {string} [selector] 하위 경로 선택자
             */
            session: function(key, selector) {
                return createProxy(key, 'session', selector);
            },

            /**
             * 로컬 스토리지 사용 (영구 저장)
             * @param {string} key 저장소 키
             * @param {string} [selector] 하위 경로 선택자
             */
            local: function(key, selector) {
                return createProxy(key, 'local', selector);
            },

            /**
             * 특정 키 삭제
             */
            remove: function(key, type = 'session') {
                const storage = type === 'local' ? window.localStorage : window.sessionStorage;
                storage.removeItem(key);
            }
        }
    });
}