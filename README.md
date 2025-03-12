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
- create single file HTML components as customElements with `<script>`, `<style>` and `<template>` under `./public/elements/{prefix}/{prefix}-{suffix}.html` 
- use them as usual customElements `<prefix-suffix>`
- you have access to the `shadowDocument` and `state`
- set state by `shadowDocument.host.dataset.state = JSON.stringify({newState})`
- use event bubbling

## NO-GOs
- **never** `addEventListener` to `shadowDocument`

## Further reading
- Check out my [examples project](https://github.com/yhwh-script/examples)
- the [SQLite extension](https://github.com/yhwh-script/sqlite)
- or (recommended) the [SQLite extension with examples](https://github.com/yhwh-script/sqlite-examples)
