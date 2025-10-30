export const moduleName = "Callbacks";

const _ephemeralCallbacks = new WeakMap();

export function addEphemeralCallback(element, callback) {
    let callbacks = _ephemeralCallbacks.get(element);

    if (!callbacks) {
        callbacks = [callback];
        _ephemeralCallbacks.set(element, callbacks);
    } else if (!callbacks.includes(callback)) {
        callbacks.push(callback);
    }
    // No explicit cleanup needed. When 'element' is GC'd, the entry goes too.
}

export function registerRuleWithCallback(template, callback) {
    callbacksForRenderSection.push(callback);
}