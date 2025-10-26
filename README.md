# elements
This is a framework for teaching you the [standards-conforming](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) **lifecycle implementation of customElements for WebComponents**. Check it out!

Minimalistic with less then 100 lines of code (LOCs) in the [main functionality](https://github.com/yhwh-script/elements/blob/main/src/elements/index.js) that will blow your mind, yet completely easy and understandable paradigm. Wanna start over?

## Installation

In an empty folder, install @yhwh-script/elements with the following command:

```npm i @yhwh-script/elements```

Then move all files from node_modules/@yhwh-script into the current folder,
overwriting package.json and everything.
You can then also savely remove node_modules ans start over with

```npm install
   npm run dev```

## Installation alternative
Please check, if npx uses the latest version.

```npx @yhwh-script/create-app {YOUR_PROJECT}```

## Yet another
Or, you can just clone this repository:

```git clone https://github.com/yhwh-script/elements.git
   cd elements
   npm install
   npm run dev
```

## How-To
- Create Your customElement `{prefix}-{suffix}` in single HTML component files with `<script>`, `<style>` and `<template>` under `./public/elements/{prefix}/{prefix}-{suffix}.html` 
- Inside each component, You have access to
   - `shadowDocument` You can work with it just like You would with the regular `document`.
   - all the modules from `/src/modules` by their `{moduleName}`

## Further reading
- Check out my [examples project](https://github.com/yhwh-script/examples)
- the [SQLite extension](https://github.com/yhwh-script/sqlite)
- or (recommended) the [SQLite extension with examples](https://github.com/yhwh-script/sqlite-examples)
