export const moduleName = "eventHandler";

// The primary storage for ephemeral callbacks
const _weakMap = new WeakMap();
const _map = new Map();

function registerWeak(weakKey, callback) {
    let callbacks = _weakMap.get(weakKey);
    console.log(weakKey, callback);
    if (!callbacks) {
        callbacks = [callback];
        _weakMap.set(weakKey, callbacks);
    } else if (!callbacks.includes(callback)) {
        callbacks.push(callback);
    }
}

function register(key, callback) {
    let callbacks = _map.get(key);
    if (!callbacks) {
        callbacks = [callback];
        _map.set(key, callbacks);
    } else if (!callbacks.includes(callback)) {
        callbacks.push(callback);
    }
}

export function registerCallback(key, callback) {
    console.log({key});
    if (Object.prototype.toString.call(key) === '[object String]') {
        register(key, callback)
    } else {
        registerWeak(key,callback)
    }    
}

/**
 * Associates a unique callback function with a DOM element (key).
 * No explicit cleanup needed. When 'element' is garbage-collected, the entry goes too.
 * @param {EventTarget} eventTarget - The DOM element (key) to track.
 * @param {Function} handler - The function to store.
 */
export function onClick(element, handler) {
    registerCallback(element, handler);
}

export function onNavigate(handler) {
    registerCallback("popstate", handler);
    registerCallback("pushstate", handler);
}

export function onEvent(type, handler) {
    if (!type) {
        throw new Error("No event type specified.");
    }
    registerCallback(type, handler);
}

addEventListener("toggle-nav", dispatch);
addEventListener("click", dispatch);
addEventListener("popstate", dispatch);
addEventListener("pushstate", dispatch);

export function dispatch(event) {
    stop(event);
    console.log("eventHandler: dispatch", event);
    if (["popstate", "pushstate"].includes(event.type)) { // key is event.type
        // callbacks (with use of history.state) can be called only after they have been registered with router
        let callbacks = getCallbacks(event.type);
        callbacks.forEach(callback => callback(location.pathname));
    } else { // "click",... key is eventTarget
        console.log(event.target)
        let eventTarget = event.target;
        let callbacks = getCallbacks(eventTarget);
        callbacks.forEach(callback => callback());
    }
}

/**
 * Retrieves all callbacks for an element and returns them.
 * @param {Object} weakKey - The DOM element (key).
 */
function getCallbacks(key) {
    if (Object.prototype.toString.call(key) === '[object String]') {
        return _map.get(key) || [];
    } else {
        return _weakMap.get(key) || [];
    }
}

function stop(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.stopPropagation();
}