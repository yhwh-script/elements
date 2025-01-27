# elements
This is a minimalistic, reactive **lifecycle implementation of customElements for WebComponents**. Check it out!

## Installation
Install elements with npm

```git clone https://github.com/yhwh-script/elements.git
   cd elements
   npm install
   npm run dev
```

## How-To
- create single file HTML components as customElements with `<script>`, `<style>` and `<template>` under `./{ELEMENTS_DIR}/{prefix}/{prefix}-{suffix}.html` 
- use them as usual `<prefix-suffix>`
- you have access to the `shadowDocument` and `state`
- set state by `shadowDocument.host.dataset.state = JSON.stringify({newState})`
- use event bubbling or check out my [state system](https://github.com/yhwh-script/state)

## NO-GOs
- **never** `addEventListener` to `shadowDocument`

## Further reading
- Check out my [examples project](https://github.com/yhwh-script/elements)
- I am also working on a [state system](https://github.com/yhwh-script/state)
- as well as a [SQLite extension](https://github.com/yhwh-script/sqlite)