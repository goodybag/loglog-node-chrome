# Loglog Node to Chrome DevTools Transport

> Logging transport from node to chrome dev tools for loglog

__Install:__

```
npm install loglog-node-chrome
```

__Usage:__

```javascript
var logger = require('loglog').create({
  transports: [
    require('loglog-dev-tools')({ /* options */ })
  ]
});
```

__Options and defaults:__

```javascript
{
  port: 8081
}
```
