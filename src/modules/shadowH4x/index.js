export const moduleName = "shadowH4x";

const _bus = {};

function patchAddEventListener(targetPrototype) {
    const originalAddEventListener = targetPrototype.addEventListener;
    targetPrototype.addEventListener = function (type, listener, options) {
        console.debug(`[addEventListener] '${type}'${this ? " on ".concat(this.tagName) : ''}: ${listener}`);
        const originalListener = listener;
        listener = function wrapper(e) {
            console.debug(`[${e.type}Wrapper] executing ${originalListener}`);
            if (e.currentTarget !== Window) {
                return originalListener.call(this, e);
            }
        };
        switch (type) {
            case "click": {
                if (!_bus["click"]) { _bus["click"] = new WeakMap(); }
                let clickListenersWeakMap = _bus["click"];
                let listeners;
                if (this) {
                    listeners = clickListenersWeakMap.get(this);
                    if (!listeners) { // there are not clickListener for this yet, initialize with new Array.
                        clickListenersWeakMap.set(this, [listener]);
                    } else { // there is at least one other clickListeners. push the listener if not already present
                        if (!listeners.get(this).includes(listener)) {
                            listeners.push(listener);
                        }
                    }
                }
                break;
            }
            default: {
                let listeners = _bus[type];
                if (!listeners) {
                    _bus[type] = [listener];
                } else {
                    if (!(listeners.includes(listener))) {
                        listeners.push(listener);
                    }
                }
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
}

// removeEventListener is not yet used anywhere
function patchRemoveEventListener(targetPrototype) {
    const originalRemoveEventListener = targetPrototype.removeEventListener;
    targetPrototype.removeEventListener = function (type, listener, options) {
        console.debug(`[removeEventListener] '${type}' from ${this?.tagName || 'EventTarget'}: ${listener}`);
        let listeners = _bus[type];
        if (type === "click" && listeners) {
            listeners = listeners.get(this);
        }
        if (listeners) {
            let index = listeners.indexOf(listener);
            if (index > 0) { listeners.splice(index, 1); }
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };
}

function patchDispatchEvent(targetPrototype) {
    // const dispatchEventOriginal = targetPrototype.dispatchEvent;
    targetPrototype.dispatchEvent = function (event) {
        console.debug(`[dispatchEvent] '${event.type}' on ${this?.tagName || 'EventTarget'}`);
        let listeners = _bus[event.type];
        if (event.type === "click" && listeners) { listeners = listeners.get(event.target); }
        if (listeners) {
            for (let listener of listeners) {
                console.debug(`[dispatchEvent] executing ${listener}`);
                listener(event);
            }
        }
        // return dispatchEventOriginal.call(this, event);
    };
}

(function patchForEventBusIIFE(prototypesToPatch) {
    for (let proto of prototypesToPatch) {
        if (proto?.addEventListener && proto.dispatchEvent) {
            patchAddEventListener(proto);
            patchRemoveEventListener(proto);
            patchDispatchEvent(proto);
        }
    }
})([EventTarget.prototype]);
// You can now use the patched methods
// addEventListener, dispatchEvent, removeEventListener
