## 2025-03-02 - [Testing Pure Logic over React Components]
**Learning:** Testing React components directly without an external test runner (like Vitest or Jest) is very difficult natively with `node:test` due to JSX parsing issues with `--experimental-strip-types`.
**Action:** The most effective and performant approach is extracting purely functional logic out of the component into pure TS functions, enabling fast native `node:test` assertions without heavy test frameworks.
