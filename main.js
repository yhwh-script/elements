import { elements } from './elements';
import { debug } from './modules/Logger.js'

Object.keys(elements).forEach(function (prefix) {
    elements[prefix].forEach(function ({ suffix, filePath }) {
        fetch(`${filePath}?raw`).then(file => file.text()).then(component => {
            const fragment = document.createRange().createContextualFragment(component);
            const scriptFragment = fragment.querySelectorAll("script")[1];
            const styleFragment = fragment.querySelector("style");
            const templateFragment = fragment.querySelector("template");
            customElements.define(`${prefix}-${suffix}`, class extends HTMLElement { // customElements must be defined using anonymous classes instead of (illegal) constructor
                static observedAttributes = ["data-state"];
                constructor() {
                    super();
                    this.attachShadow({ mode: "open" });
                    debug("CONSTRUCTOR CALLED", this.outerHTML);
                }
                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue != newValue) {
                        debug("STATE CHANGED");
                        console.log("OLD STATE", oldValue);
                        console.log("NEW STATE", newValue);
                        // debug("REPLACING CHILDREN");
                        // this.shadowRoot.replaceChildren(); // this is safe https://dom.spec.whatwg.org/#dom-parentnode-replacechildren
                        // debug("REMOVING LISTENERS VIA CLONE");
                        // this.replaceWith(this.cloneNode(false)); // remove all listeners
                        // debug("CLONED", this.outerHTML);
                        // if (this.isConnected) {
                        //     console.log("IS CONNECTED", this.outerHTML);
                        //     // this.disconnectedCallback();
                        //     // if (this.hostDataIDs !== undefined && this.hostDataIDs.length > 0) {
                        //     //     this.connectedCallback();
                        //     // }
                        // }
                        // this.render();
                    }
                }
                connectedCallback() {
                    debug("CONNECTING", this.outerHTML);
                    if (this.hostDataIDs !== undefined && this.hostDataIDs.length > 0) {
                        console.log("WAS CONNECTED");
                    } else {
                        this.hostDataIDs = []; // the hostDataIDs are used to find the shadowRoot for the WebComponent from the script
                        this.dataset.id = Math.random().toString(16).substring(2, 8);
                        let hostElement = this;
                        while (hostElement && hostElement.dataset.id) {
                            this.hostDataIDs.push(hostElement.dataset.id);
                            hostElement = hostElement.getRootNode().host;
                        }
                    }
                    console.log("CONNECTED", this.outerHTML);
                    this.render();
                }
                render() {
                    debug("RENDERING", this.outerHTML);
                    if (templateFragment) {
                        const newRange = document.createRange().createContextualFragment(templateFragment.innerHTML);
                        this.shadowRoot.replaceChildren(newRange);
                    }
                    if (styleFragment) {
                        const clonedStyle = styleFragment.cloneNode(true);
                        this.shadowRoot.appendChild(clonedStyle);
                    }
                    if (scriptFragment) {
                        const scriptElement = this.#createScript();
                        this.shadowRoot.appendChild(scriptElement);
                    }
                    debug("RENDERED", this.outerHTML);
                }
                disconnectedCallback() {
                    console.log("DISCONNECTING", JSON.stringify(this.hostDataIDs));
                    debug("REPLACING CHILDREN");
                    this.shadowRoot.replaceChildren(); // this is safe https://dom.spec.whatwg.org/#dom-parentnode-replacechildren
                    debug("REMOVING LISTENERS VIA CLONE");
                    this.replaceWith(this.cloneNode(false)); // remove all listeners
                    debug("CLONED", this.outerHTML);
                    this.hostDataIDs = [];
                    // if (this.hostDataIDs !== undefined && this.hostDataIDs.length > 0) {
                    // }
                }
                #createScript() {
                    const scriptElement = document.createElement("script");
                    scriptElement.setAttribute("type", "module");
                    scriptElement.textContent = `
const shadowDocument = (function getDOM(hostDataIDs = '${this.hostDataIDs.toReversed().toString()}') {
    let shadowDocument = document;
    for (let hostDataID of hostDataIDs.split(',')) {
        const host = shadowDocument.querySelector('[data-id="' + hostDataID + '"]');
        if (host) {
            shadowDocument = host.shadowRoot;
        } else {
            return null;
        }
    }
    return shadowDocument;
})();
if (shadowDocument) {
    const $ = (query) => shadowDocument.querySelector(query);
    const $$ = (query) => shadowDocument.querySelectorAll(query);
    const state = shadowDocument.host.dataset.state ? JSON.parse(shadowDocument.host.dataset.state) : undefined;
    ${scriptFragment ? scriptFragment.textContent : ''}
} else {
    // console.error("This element did not exist.");
}`;
                    return scriptElement;
                }
            });
        });
    });
});
