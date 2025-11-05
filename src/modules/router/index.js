export const moduleName = "router";

let _sitemap = [];

export function getMapping(pathname) {
    let errorMapping = { "title": "404", "template": "error-404" };
    let resources = pathname.split("/");
    let mapping;
    if (resources[1]) { // no single slash
        for (let route of _sitemap[resources.length - 1]) {
            if (route[pathname]) { mapping = route[pathname]; }
        }
        if (!mapping) { mapping = errorMapping; }
    } else { mapping = _sitemap[0][0][pathname] }
    if (!customElements.get(mapping.template)) { return errorMapping; }
    return mapping;
}

export function initSitemap(sitemap) { _sitemap = sitemap; }

export function push(pathname) {
    let mapping = getMapping(pathname);
    history.pushState(mapping.template, mapping.title, pathname);
}

(function createRouter(history) {
    const pushStateOriginal = history.pushState;
    history.pushState = function patchedPushState() {
        const result = pushStateOriginal.apply(history, arguments);
        dispatchEvent(new Event('pushstate', { bubbles: false, composed: false }));
        return result;
    };
})(window.history);

// workaround to access at least the first routing level when url entered into browser's address bar 
const resources = (location.pathname).split("/");
if (resources.length > 2) { push(resources.slice(0, 2).join("/")); }
