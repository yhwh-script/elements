var _sitemap = [];

(function write(history) {
    const pushStateOriginal = history.pushState;
    history.pushState = function () {
        const result = pushStateOriginal.apply(history, arguments);
        dispatchEvent(new Event('pushstate', { bubbles: false, composed: false }));
        return result;
    };
})(history);


function push(pathname) {
    let mapping = getMapping(pathname);
    history.pushState(mapping.template, mapping.title, pathname);
}

export const moduleName = "router";

export function init(sitemap) {
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

export function clickHandler(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    let a = clickEvent.target.closest("li").querySelector("a");
    push(a.getAttribute("href"));
}

const _callbacks = [];
export function register(callback) {
    callback(); // invoke immediately
    if (!_callbacks.includes(callback)) {
        _callbacks.push(callback);
    } // otherwise already present
}

function routerHandler(event) {
    if (["popstate", "pushstate"].includes(event.type)) {
        event.preventDefault();
        event.stopPropagation();
        _callbacks.forEach(callback => callback(location.pathname)); // callbacks (with use of history.state) can be called only after they have been registered with router
    }
}

addEventListener("popstate", routerHandler);
addEventListener("pushstate", routerHandler);

// workaround to access at least the first level
const resources = (location.pathname).split("/");
if (resources.length > 2) {
    push(resources.slice(0, 2).join("/"));
}