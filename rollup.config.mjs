import terser from '@rollup/plugin-terser';

export default [
    // 1. CDN용 빌드 (전역 변수용) -> <script> 태그 사용 시
    {
        input: 'src/index.js',
        output: {
            file: 'dist/ro-storage.min.js',
            format: 'umd',
            name: 'RoStorage', // window.RoStorage 로 접근 가능
            globals: {
                '@mars-/ro': 'ro' // peerDependency인 ro를 전역변수 'ro'와 연결
            },
            sourcemap: true
        },
        external: ['@mars-/ro'], // ro는 번들에 포함하지 않음 (외부 의존성)
        plugins: [terser()] // 코드 압축
    },
    // 2. NPM용 빌드 (ESM/CJS) -> import/require 사용 시
    {
        input: 'src/index.js',
        output: [
            { file: 'dist/ro-storage.js', format: 'cjs', sourcemap: true },
            { file: 'dist/ro-storage.mjs', format: 'es', sourcemap: true }
        ],
        external: ['@mars-/ro']
    }
];