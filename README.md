# @mars-/ro-storage

Reactive Storage Plugin for `@mars-/ro`.
Uses JavaScript Proxy to automatically synchronize object state with `sessionStorage` or `localStorage`.

## Installation

```bash
npm install @mars-/ro @mars-/ro-storage
```

## Setup

Register the plugin using `ro.use()`.

```javascript
import ro from '@mars-/ro';
import RoStorage from '@mars-/ro-storage';

// Register the plugin
ro.use(RoStorage);
```

## Usage

### 1. Create Storage (Recommended)
You can use `ro.storage.create()` to easily connect to storage.

**Basic Usage (Session Storage by default):**
```javascript
const myState = ro.storage.create('MY_APP_KEY');

myState.count = 10; // Automatically saved to sessionStorage
console.log(myState.count); // 10
```

**Advanced Usage (with Options):**
```javascript
// Local Storage
const localState = ro.storage.create({
    key: 'MY_LOCAL_KEY',
    type: 'local'
});

// With Selector (Access nested property directly)
const userSettings = ro.storage.create({
    key: 'MY_APP_KEY',
    selector: 'user.settings'
});
```

### 2. Direct Access (Object Style)
You can access storage keys directly as properties.

```javascript
// Access 'MY_KEY' in Session Storage
const data = ro.storage.session.MY_KEY;

// Access 'MY_LOCAL_KEY' in Local Storage
const localData = ro.storage.local.MY_LOCAL_KEY;

// Write directly
ro.storage.session.NEW_KEY = { foo: 'bar' };
```

### 3. Inspection & Debugging
Helper functions to inspect storage contents.

**Get Keys:**
```javascript
// Get all keys in Session Storage
ro.storage.getKeys(); 
// or
ro.storage.getSessionKeys();

// Get all keys in Local Storage
ro.storage.getKeys('local');
// or
ro.storage.getLocalKeys();

// Get keys of a specific object inside storage
ro.storage.getKeys('session', 'MY_KEY.user');
```

**Get JSON Data:**
```javascript
// Get full Session Storage as JSON object
const allSession = ro.storage.getJson();

// Get specific data
const userData = ro.storage.getJson('local', 'MY_KEY.user');
```

### 4. Remove Data
```javascript
// Remove from storage
ro.storage.remove('MY_APP_KEY'); // defaults to session
ro.storage.remove('MY_LOCAL_KEY', 'local');
```

## Development

1. **Build Project**
   ```bash
   npm install
   npm run build
   ```

2. **Run Tests**
   ```bash
   npm run test:node
   # Or open test/browser/index.html in your browser
   ```
