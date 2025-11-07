# elements
This is a [bus-featured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#closures) framework for [standards-conforming **WebComponents**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). Although it's unofficial You should check it out! Wait. Did You read about an 'EventBus' under closures? No. That's on purpose. Because here I implemented it.

Minimalistic in the [main functionality](https://github.com/yhwh-script/elements/blob/main/src/elements/index.js) with less than 100 lines of code (LOCs) that will blow your mind, yet completely easy to follow paradigm, if you get it. ;)

Wanna think vanilla? Are you tired of all the frameworks? I think, I might have something for ya.

## Installation

In an empty folder, install @yhwh-script/elements with the following command:

```npm i @yhwh-script/elements```

Then move all files from node_modules/@yhwh-script into the current folder,
overwriting package.json and everything. (Yeah, I'll need a postinstall script for that.)
You can then also savely remove node_modules and start over with

```
   npm install
   npm run dev
```

### Yet another
Or, you can just clone this repository:

```
   git clone https://github.com/yhwh-script/elements.git
   cd elements
   npm install
   npm run dev
```

### Deprecated installation alternative
Please check, if npx uses the latest version. Otherwise it may

```
    npx @yhwh-script/create-app {YOUR_PROJECT}
```

## Limitations
The gen.cjs script creates a `src/elements/elements.js` file with the `filePath` to the `htmlFiles` used by `/src/elements/index.js`. It looks like:
```
export const htmlFiles=[
  "elements/a/a-index.html",
  "elements/error/error-404.html",
  "elements/home/home-page.html",
  "elements/navigation/navigation-hamburger.html",
  "elements/navigation/navigation-links.html",
  "elements/page/page-a.html",
  "elements/page/page-b.html",
  "elements/router/router-app.html"
];
```
This means, You'll have to put Your CustomElements SFCs under public/elements in order for them to work properly!

## How-To
- Create Your CustomElement in HTML files with `<script>`, `<style>` and `<template>` under `./public/elements/{prefix}/{prefix}-{suffix}.html`. Although not fully supported, the naming is [standards-conforming](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name). `{prefix}-{suffix}`. At this moment, no more dashes allowed.
- Inside each component, You have access to
   - `shadowDocument` You can work with it just like You would with the regular `document`.
   - all the modules from `/src/modules` by their `export const moduleName`

## Further reading
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#registering_a_custom_element)

