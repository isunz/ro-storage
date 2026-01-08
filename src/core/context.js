// [ro-storage] src/core/context.js

// 모듈 스코프 변수 (ro 인스턴스 저장용)
let _ro = null;

export function setRo(ro) {
    _ro = ro;
}

export function getRo() {
    return _ro;
}