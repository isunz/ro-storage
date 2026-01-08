# @mars-/ro-storage

Reactive Storage Plugin for `@mars-/ro`.
Uses JavaScript Proxy to automatically synchronize object state with `sessionStorage` or `localStorage`.

## Setup

1. Install
   ```bash
   npm install @mars-/ro @mars-/ro-storage
   ```

2. Build Project
   ```bash
   npm install
   npm run build
   ```

3. Run Tests
   ```bash
   npm run test:node
   # Or open test/browser/index.html in your browser
   ```

## Usage

```javascript
import ro from '@mars-/ro';
import RoStorage from '@mars-/ro-storage';

// 1. Register
RoStorage(ro);

// 2. Use
const state = ro.storage.session('MY_APP_STATE');
state.count = 1; // Saved to Session Storage immediately!
```