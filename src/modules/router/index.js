export const moduleName = "router";



export function test(target, listener) {
    console.log(`Registering RouterListener ${listener} on ${target}.`); // maybe window?
}

function push(pathname) {
    let mapping = getMapping(pathname);
    history.pushState(mapping.template, mapping.title, pathname);
}

var _sitemap = [];
export function initSitemap(sitemap) {
    _sitemap = sitemap;
}

export function getMapping(pathname) {
    let errorMapping = { "title": "404", "template": "error-404" };
    let resources = pathname.split("/");
    let mapping;
    if (resources[1]) { // no single slash
        for (let route of _sitemap[resources.length - 1]) {
            if (route[pathname]) {
                mapping = route[pathname];
            }
        }
        if (!mapping) {
            mapping = errorMapping;
        }
    } else {
        mapping = _sitemap[0][0][pathname]
    }
    if (!customElements.get(mapping.template)) {
        return errorMapping;
    }
    return mapping;
}

export function clickHandlerDeprecated(clickEvent) {
    // FIX: assumes all clickEvents originate from an li>a
    let a = clickEvent.target.closest("li").querySelector("a");
    push(a.getAttribute("href"));
}

export function clickHandler(element) {
    // FIX: assumes element is an li>a
    let a = element.closest("li").querySelector("a");
    push(a.getAttribute("href"));
}

const _callbacks = [];
export function onNavigate(callback) {
    callback(); // invoke immediately
    if (!_callbacks.includes(callback)) {
        _callbacks.push(callback);
    } // otherwise already present
}

// workaround to access at least the first routing level when url entered into browser's address bar 
const resources = (location.pathname).split("/");
if (resources.length > 2) {
    push(resources.slice(0, 2).join("/"));
}
