# elements
This is a minimalistic, reactive **lifecycle implementation of customElements for WebComponents**. Check it out!

## Installation
It is recommended to use npx

```npx @yhwh-script/create-app {YOUR_PROJECT}```

However, you can also clone this repository:

```git clone https://github.com/yhwh-script/elements.git
   cd elements
   npm install
   npm run dev
```

## How-To
- Create Your customElement `{prefix}-{suffix}` in single HTML component files with `<script>`, `<style>` and `<template>` under `./public/elements/{prefix}/{prefix}-{suffix}.html` 
- Inside each component, You have access to
   - `shadowDocument`. You can work with it just like You would with the regular `document`.
   - all the modules from `/src/modules` by their `{moduleName}`

## Further reading
- Check out my [examples project](https://github.com/yhwh-script/examples)
- the [SQLite extension](https://github.com/yhwh-script/sqlite)
- or (recommended) the [SQLite extension with examples](https://github.com/yhwh-script/sqlite-examples)
