import { elements } from './elements';

Object.keys(elements).forEach(function (prefix) {
    elements[prefix].forEach(function ({ suffix, filePath }) {
        fetch(`${filePath}?raw`).then(file => file.text()).then(component => {
            const fragment = document.createRange().createContextualFragment(component);
            const scriptFragment = fragment.querySelectorAll("script")[1];
            const styleFragment = fragment.querySelector("style");
            const templateFragment = fragment.querySelector("template");
            customElements.define(`${prefix}-${suffix}`, class extends HTMLElement {
                static observedAttributes = ["data-state"];
                constructor() {
                    super();
                    this.attachShadow({ mode: "open" });
                }
                connectedCallback() {
                    this.hostDataIDs = []; // the hostDataIDs are used to getDOM from the script
                    this.dataset.id = Math.random().toString(16).substring(2, 8);
                    let hostElement = this;
                    while (hostElement && hostElement.dataset.id) {
                        this.hostDataIDs.push(hostElement.dataset.id);
                        hostElement = hostElement.getRootNode().host;
                    }
                    this.shadowRoot.replaceChildren();
                    if (scriptFragment?.getAttributeNames().includes('prefer')) {
                        this.#appendScript();
                        this.#appendTemplate();
                        this.#appendStyle();
                    } else {
                        this.#appendTemplate();
                        this.#appendStyle();
                        this.#appendScript();
                    }
                }
                attributeChangedCallback() {
                    if (this.isConnected) {
                        this.replaceWith(this.cloneNode(false)); // remove all listeners and reconstruct
                    }
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

const $ = (query) => shadowDocument.querySelector(query);
const $$ = (query) => shadowDocument.querySelectorAll(query);
const state = shadowDocument.host.dataset.state ? JSON.parse(shadowDocument.host.dataset.state) : undefined;

${scriptFragment ? scriptFragment.textContent : ''}
`;
                    return scriptElement;
                }
                #appendScript() {
                    if (scriptFragment) {
                        let scriptElement = this.#createScript(); // TODO: compile template to use state
                        this.shadowRoot.appendChild(scriptElement);
                    }
                }
                #appendStyle() {
                    if (styleFragment) {
                        let clonedStyle = styleFragment.cloneNode(true);
                        this.shadowRoot.appendChild(clonedStyle);
                    }
                }
                #appendTemplate() {
                    if (templateFragment) {
                        let documentFragment = document.createRange().createContextualFragment(templateFragment.innerHTML)
                        this.shadowRoot.appendChild(documentFragment);
                    }
                }
            });
        });
    });
});
