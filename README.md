# elements
Custom elements for the yhwh-script framework.

## Installation
```git clone https://github.com/yhwh-script/elements.git
   cd elements
   npm install
   npm run gen
   npm run dev
```

## How-To
- create single HTML files for customElements under `./{ELEMENTS_DIR}/{prefix}/{prefix}-{suffix}.html`
- you have access to the `shadowDocument`, `state`
- set state by `shadowDocument.host.dataset.state = JSON.stringify({newState})`

## NO-GOs
- never `addEventListener` to `shadowDocument`