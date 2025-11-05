export const moduleName = "eventBus";

const _bus = {};

function patchAddEventListener(targetPrototype) {
    const originalAddEventListener = targetPrototype.addEventListener;
    targetPrototype.addEventListener = function (type, listener, options) {
        let listeners = _bus[type];
        if (type == "click") { // use WeakMap for clickListeners
            if (listeners) {
                let clickListenersForThis = listeners.get(this);
                if (clickListenersForThis) { clickListenersForThis.push(listener); }
            } else {
                listeners = new WeakMap();
                listeners.set(this, [listener]);
                _bus[type] = listeners;
            }
        } else
            if (listeners) { listeners.push(listener) }
            else { _bus[type] = [listener]; }
        return originalAddEventListener.apply(this, arguments);
    };
}

function patchRemoveEventListener(targetPrototype) {
    const originalRemoveEventListener = targetPrototype.removeEventListener;
    targetPrototype.removeEventListener = function (type, listener, options) {
        let listeners;
        if (type === "click") { listeners = _bus[type].get(this); }
        else { listeners = _bus[type]; }
        let index = listeners.indexOf(listener);
        if (index > 0) { listeners.splice(index, 1); }
        return originalRemoveEventListener.apply(this, arguments);
    };
}

function patchDispatchEvent(targetPrototype) {
    const originalDispatchEvent = targetPrototype.dispatchEvent;
    targetPrototype.dispatchEvent = function (event) {
        let listeners = _bus[event.type];
        if (event.type === "click") { listeners = listeners.get(event.target); }
        for (let listener of listeners) { listener(event); }
        return originalDispatchEvent.apply(this, arguments);
    };
}

(function createEventBus(prototypesToPatch) {
    for (let proto of prototypesToPatch) {
        if (proto?.addEventListener && proto.dispatchEvent) {
            patchAddEventListener(proto);
            patchRemoveEventListener(proto);
            patchDispatchEvent(proto);
        }
    }
})([Document.prototype, HTMLElement.prototype]);
