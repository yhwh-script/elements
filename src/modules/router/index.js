export const moduleName = "router";

(function write(history) {
    const pushStateOriginal = history.pushState;
    history.pushState = function overwritePushStateToDispatchPushStateEvent() {
        const result = pushStateOriginal.apply(history, arguments);
        dispatchEvent(new Event('pushstate', { bubbles: false, composed: false }));
        return result;
    };
})(window.history);

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

export function clickHandler(clickEvent) {
    console.log("clickHandler");
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    let a = clickEvent.target.closest("li").querySelector("a"); // assumes all clickEvents originate from an li>a
    push(a.getAttribute("href"));
}

const _callbacks = [];
export function onNavigate(callback) {
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

// workaround to access at least the first routing level when url entered into browser's address bar 
const resources = (location.pathname).split("/");
if (resources.length > 2) {
    push(resources.slice(0, 2).join("/"));
}
