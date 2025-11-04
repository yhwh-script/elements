// TODO this module should actually be called 

export const moduleName = "eventBus";

const _weakMap = new WeakMap();

/**
 * Ruft die gespeicherten Listener für ein bestimmtes Element ab.
 * @param {EventTarget} target - Das Element, dessen Listener gesucht werden.
 * @returns {Array} Liste der registrierten Listener oder ein leeres Array.
 */
function getListeners(target) {
    if (target && target.constructor instanceof EventTarget.constructor) {
        return _weakMap.get(target);
    } else { // TODO check if Document or HTMLElement is needed here
        console.log("Registering on undefined"); // addEventListener
    }
    return [];
}

/**
 * Führt das Patchen einer Methode auf dem Prototyp durch.
 * @param {Object} targetPrototype - Der Prototyp, der gepatcht werden soll (z.B. EventTarget.prototype, oder window).
 */
function patchAddEventListener(targetPrototype) {
    const originalAddEventListener = targetPrototype.addEventListener;
    targetPrototype.addEventListener = function (type, listener, options) {
        console.log(`Registering ${type} on`, this);
        if (this.constructor.prototype === Window.prototype) {
            return originalAddEventListener.apply(this, arguments);
        } else if (this && this.constructor instanceof EventTarget.constructor) {
            let listeners = getListeners(this);
            if (!listeners) {
                listeners = {};
                listeners[type] = [listener];
                _weakMap.set(this, listeners);
            } else {
                let registeredListenersForType = listeners[type] || [];
                if (!registeredListenersForType.includes(listener)) {
                    registeredListenersForType.push(listener);
                }
            }
        }
        return originalAddEventListener.apply(this, arguments);
        switch (type) {
            case "click":
                console.debug(`Registering ClickListener ${listener} on ${this}.`); // maybe window?
                break;
            // case "popstate":
            //     console.debug(`Registering PopListener ${listener} on ${this}.`); // maybe window?
            //     break;
            // case "pushstate":
            //     console.debug(`Registering PushListener ${listener} on ${this}.`); // maybe window?
            //     break;
            case "toggle-nav":
                console.log("toggle-nav", listener);
                break;
            default:
        }

        // Prüfen, ob der Listener bereits registriert ist

        if (!listeners.some(l => l.type === type && l.listener === listener)) {
            listeners.push({ type, listener, options });

            // START

            if (typeof targetPrototype === EventTarget.prototype) {

            }
            if (typeof targetPrototype === Window.prototype) {
                console.log("IS Window!");
            }
            if (typeof targetPrototype === Document.prototype) {
                console.log("IS Document!");
            }
            if (typeof targetPrototype === HTMLElement.prototype) {
                console.log("IS HTMLElement!");
            }
            // END
            // _eventHandler[this]
            // _registeredListeners.set(this, listeners);

            console.log(`[MONITOR ADD] Element: <${this.tagName || 'Window/Document'}>, Event: ${type}`);
        }

        listeners = getListeners(this, type);
        console.log({ listeners });
    };
}

function patchRemoveEventListener(targetPrototype) {
    const originalRemoveEventListener = targetPrototype.removeEventListener;
    targetPrototype.removeEventListener = function (type, listener, options) {

        let listeners = getListeners(this);

        // Listener aus der internen Liste entfernen
        const initialLength = listeners.length;
        listeners = listeners.filter(l => !(l.type === type && l.listener === listener));

        if (listeners.length < initialLength) {
            _eventHandler.set(this, listeners);
            console.log(`[MONITOR REMOVE] Element: <${this.tagName || 'Window/Document'}>, Event: ${type}`);
        }

        // Original-Methode aufrufen
        originalRemoveEventListener.call(this, type, listener, options);
    };
}

function patchDispatchEvent(targetPrototype) {
    const originalDispatchEvent = targetPrototype.dispatchEvent;
    targetPrototype.dispatchEvent = function (event) {
        // TODO check use of listeners in WeakMap/ type etc.
        const listeners = getListeners(event.type);
        console.log(listeners[event.type]);
        listeners[event.type].forEach(callback => {
            callback();
        });
        const result = originalDispatchEvent.call(this, event);
        console.log(`[EVENT DISPATCHED] Type: ${event.type} on Element: ${this}, result: ${result}`);
        // let listeners = getListeners(this);
        return result;
    };
}

// if (typeof EventTarget !== 'undefined' && EventTarget.prototype) {
//     patchAddEventListener(EventTarget.prototype);
//     patchRemoveEventListener(EventTarget.prototype);
// }

// if (typeof window !== 'undefined') {
//     console.log("TEST", Window.prototype)
//     patchAddEventListener(Window.prototype);
//     patchRemoveEventListener(Window.prototype);
// }

// patchDispatchEvent();

const prototypesToPatch = [
    EventTarget.prototype,
    // Window.prototype,
    // Document.prototype,
    // HTMLElement.prototype
];

prototypesToPatch.forEach(proto => {
    if (proto && proto.addEventListener) {
        console.log("PATCH addEventListener on", proto)
        patchAddEventListener(proto);
        patchRemoveEventListener(proto);
        // proto.addEventListener = createAddEventListenerWrapper(originalAddEventListener);
    }
    if (proto && proto.dispatchEvent) {
        console.log("PATCH dispatchEvent on", proto)
        patchDispatchEvent(proto);
    }
});

(function (history) {
    console.debug("PATCH pushState on", history);
    console.debug("(to dispatch pushstate event, when pushState is called)");
    const pushStateOriginal = history.pushState;
    history.pushState = function patchedPushState() {
        const result = pushStateOriginal.apply(history, arguments);
        dispatchEvent(new Event('pushstate', { bubbles: false, composed: false }));
        return result;
    };
})(window.history);

window.addEventListener("popstate", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log("calling popstate")
})
window.addEventListener("pushstate", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log("calling pushstate")
})

// Window -> WeakMap -> OPFS (SQLite WASM)