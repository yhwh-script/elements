export const moduleName = "router";

let _sitemap = [
    [
        { "/": { "title": "Home", "template": "home-page" } }
    ],
    [
        { "/a": { "title": "Page A", "template": "page-a" } },
        { "/b": { "title": "Page B", "template": "page-b" } },
        { "/c": { "title": "Page C", "template": "page-c" } }
    ]
];

export function getMapping(pathname) {
    let errorMapping = { "title": "404", "template": "error-404" };
    let resources = pathname.split("/");
    let mapping;
    if (resources[1]) { // URL is no single slash /, which would be only resources[0]
        for (let route of _sitemap[resources.length - 1]) {
            if (route[pathname]) { mapping = route[pathname]; }
        }
        if (!mapping) { mapping = errorMapping; }
    } else { mapping = _sitemap[0][0][pathname] }
    if (!customElements.get(mapping.template)) { return errorMapping; }
    return mapping;
}

export function push(pathname) {
    let mapping = getMapping(pathname);
    history.pushState(mapping.template, mapping.title, pathname);
}

(function patchPushStateIIFE(history) {
    const pushStateOriginal = history.pushState;
    history.pushState = function patchedPushState(state, unused, url) {
        pushStateOriginal.call(history, state, unused, url);
        dispatchEvent(new Event('pushstate', { bubbles: false, composed: false }));
    };
})(window.history);

addEventListener("pushstate", function onPushstateDebug(e) {
    // TODO make e look like the PopStateEvent
    console.debug(`[ROUTING] to ${location.pathname}`);
});

addEventListener("popstate", function onPopstateDebug(e) {
    console.debug(`[ROUTING] to ${location.pathname}`);
});

// workaround to access at least the first routing level when url entered into browser's address bar 
const resources = (location.pathname).split("/");
if (resources.length > 2) { push(resources.slice(0, 2).join("/")); }
